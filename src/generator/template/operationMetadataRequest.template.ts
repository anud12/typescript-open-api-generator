import {OpenAPIV3} from "openapi-types";
import {typeDefinitionTemplate} from "./typeDefinition.template";
import {OperationMetadata} from "../../fromOperation/operationMetadata.fromOperation";
import {templateString} from "../helper/templateString";
import {Template} from "./template.type";
import {operationMetadataResponseTemplate} from "./operationMetadataResponse.template";
import {typeMetadataCreateUnion} from "../../fromOperation/typeMetadataCreateUnion";

export const bodyToFormDataTemplate = () => templateString()`
  export const bodyToFormData = (body: any): FormData => {
    return Object.entries(body ?? {}).reduce((formData, [key, value]) => {
      const appendTo = (element: unknown) => {
        if(element === undefined) {
          return;
        }
        if(element instanceof Blob) {
          formData.append(key, element);
          return;
        }
        if(typeof element === "string") {
          formData.append(key, element);
          return;
        }
        formData.append(key, JSON.stringify(element));
      }
      if(value instanceof Array) {
        value.forEach(element => appendTo(element));
        return formData;
      }
      appendTo(value);
      return formData;
    }, new FormData()) 
  }
`


export const operationMetadataRequestTemplate = (componentObject: OpenAPIV3.ComponentsObject, model?: OperationMetadata): Template => {
  return () => {
    const parameters = model.pathParameters.children.length || model.queryParameters.children.length ?
      typeDefinitionTemplate(componentObject, typeMetadataCreateUnion(model.pathParameters, model.queryParameters))()
      : undefined;

    const body = !model.hasBody
      ? undefined
      : templateString("  ")`${parameters && ", "}body: ${typeDefinitionTemplate(componentObject, model.body)?.()}`.trimStart();

    return templateString()`
    (${parameters && templateString("  ")`parameters: ${parameters}`.trimStart()}${body}) => {
      return fetcher.call(urlBuilder(${parameters && "parameters"}), {
        method: "${model.method}",
      ${model.isRequestType.applicationJson && templateString("  ")`
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        }`}
        ${model.isRequestType.multipartFormData && templateString()`
        body: bodyToFormData(body),
        headers: {}`}
      })
    ${templateString("  ")`${operationMetadataResponseTemplate(componentObject, model.response)()}`}
    }
    `
  }
};
