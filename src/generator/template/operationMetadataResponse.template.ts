import {OpenAPIV3} from "openapi-types";
import {ResponseMetadata} from "../../fromOperation/responseMetadata.fromOperation";
import {templateString} from "../helper/templateString";
import {typeDefinitionTemplate} from "./typeDefinition.template";
import {Template} from "./template.type";

const bodyTemplate = (componentObject: OpenAPIV3.ComponentsObject, model?: ResponseMetadata) => {

  const useBlob = model.typeMetadata.metadataType === "object"
    && model.typeMetadata.children.filter(model => model.name === "blob").length > 0;

  if (useBlob) {
    return templateString("")`
      const blob = await value.blob();
      let filename = value?.headers?.get('content-disposition')?.split('; filename=')[1];
      if(!filename) {
        filename = new Date().toISOString();
      }
      filename = decodeURIComponent(filename);
      return {blob, filename};
    `
  }

  const useJson = model.typeMetadata.metadataType === "reference"
    || model.typeMetadata.metadataType === "object"
    || model.typeMetadata.metadataType === "array";

  if (useJson) {
    return templateString("")`
      return await value.json();
    `
  }

  if(model.typeMetadata.metadataType === "primitive" && model.typeMetadata.type === "number") {
    return templateString("")`
      return Number(await value.text());
    `
  }

  if(model.typeMetadata.metadataType === "primitive" && model.typeMetadata.type === "boolean") {
    return templateString("")`
      if((await value.text()).toLowerCase() === "false") {
        return false;
      }
      return true;
    `
  }
  return templateString("")`
    return await value.text();
  `
}

export const operationMetadataResponseTemplate = (componentObject: OpenAPIV3.ComponentsObject, model?: ResponseMetadata): Template => {
  if (!model) {
    return () => undefined
  }
  return () => {
    return templateString()`
    .then<${typeDefinitionTemplate(componentObject, model.typeMetadata)()}>(async value => {
      if(!value.ok){
        throw await value.json();
      }
      
      ${bodyTemplate(componentObject, model)}
      
    })
    `
  }
};
