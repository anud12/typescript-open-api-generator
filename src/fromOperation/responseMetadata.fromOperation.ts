import {OpenAPIV3} from "openapi-types";
import {typeMetadataFromSchemaObject} from "./typeMetadata.fromSchemaObject";
import {ObjectType, TypeMetadata} from "./typeMetadata.type";

export type ResponseMetadata = {
  status: string,
  mimeType: string,
  requestResult: TypeMetadata,
  typeReferenceList: Array<TypeMetadata>,
  typeMetadata: TypeMetadata,
}

const requestResult: ObjectType = {
  metadataType: "object",
  children: [{
    metadataType: "primitive",
    type: "T",
    name: "success",
    isOptional: true,
  }, {
    metadataType: "primitive",
    type: "TError",
    name: "error",
    isOptional: true,
  }, {
    metadataType: "primitive",
    type: "Awaited<ReturnType<typeof fetch>>",
    name: "response",
  }],
  references: [],
}

export const responseMetadataFromResponsesObject = (
  componentObject: OpenAPIV3.ComponentsObject,
  responsesObject: OpenAPIV3.ResponsesObject,
): ResponseMetadata | undefined => {
  const responseStatusList = Object.keys(responsesObject);
  if (responseStatusList.length === 0) {
    return undefined;
  }

  const responseStatus = responseStatusList[0];
  const response200 = responsesObject[responseStatus] as OpenAPIV3.ResponseObject;

  const type = Object.keys(response200?.content ?? {})?.[0];
  if (!type) {
    return undefined;
  }
  const content = response200?.content[type];

  let typeMetadata = typeMetadataFromSchemaObject(componentObject, content.schema);
  const typeReferenceArray = [] as Array<TypeMetadata>;
  if (typeMetadata?.metadataType === "reference") {
    typeReferenceArray.push(typeMetadata);
  }
  if (typeMetadata?.metadataType === "array") {
    typeReferenceArray.push(typeMetadata);
  }
  if (typeMetadata?.metadataType === "object") {
    typeReferenceArray.push(typeMetadata);
  }
  if (typeMetadata?.metadataType === "primitive" && typeMetadata?.type === "Blob") {
    typeMetadata = {
      metadataType: "object",
      references: [],
      children: [{
        name: "blob",
        metadataType: "primitive",
        type: "Blob"
      }, {
        name: "filename",
        metadataType: "primitive",
        type: "string"
      }]
    }
  }

  return {
    status: responseStatus,
    typeReferenceList: typeReferenceArray,
    mimeType: type,
    requestResult: requestResult,
    typeMetadata: typeMetadata
  };
}