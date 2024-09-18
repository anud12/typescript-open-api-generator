import {OpenAPIV3} from "openapi-types";
import {typeMetadataFromSchemaObject} from "./typeMetadata.fromSchemaObject";
import {ResponseMetadata, responseMetadataFromResponsesObject} from "./responseMetadata.fromOperation";
import {ObjectType, TypeMetadata} from "./typeMetadata.type";

export type OperationMetadata = {
  method: string,
  requestPath: string,
  controllerName: string,
  operationName: string,
  hasBody: boolean,
  isRequestType: Partial<Record<"applicationJson" | "multipartFormData", boolean>>
  body?: TypeMetadata,
  pathParameters: ObjectType,
  queryParameters: ObjectType,
  dependencyList?: Array<TypeMetadata>,
  response?: ResponseMetadata,
}


const urlExtractPathParameters = (url?: string): ObjectType => {
  const acc: ObjectType = {
    metadataType: "object",
    children: [],
    references: [],
  }
  const start = [...(url.match(/{(.*?)}/g) ?? [])];
  return start
    .filter(e => e.trim())
    .reduce((acc, value: string) => {
      acc.children.push({
        name: value.replace("{", "").replace("}", ""),
        metadataType: "primitive",
        type: "string | number"
      })
      return acc;
    }, acc);
};


const operationObjectExtractQueryParameters = (operation?: OpenAPIV3.OperationObject): ObjectType => {
  const acc: ObjectType = {
    metadataType: "object",
    children: [],
    references: [],
  }

  return operation?.parameters
    ?.filter((value: OpenAPIV3.ParameterObject) => {
      return value?.in === "query";
    })
    ?.reduce((acc, value: OpenAPIV3.ParameterObject) => {

      acc.children.push({
        name: value.name,
        metadataType: "primitive",
        type: "string | number",
        isOptional: !value.required,
      })
      return acc;
    }, acc)
};

export const operationMetadataFromOperation = (
  url: string,
  method: string,
  operationObject: OpenAPIV3.OperationObject,
  componentObject: OpenAPIV3.ComponentsObject,
): OperationMetadata => {
  const typeReferenceList = [] as Array<TypeMetadata>;
  const controllerName = toPascalCase(operationObject.tags.join(""));
  const operationId = operationObject.operationId.split("_")[0];


  const requestBody = operationObject.requestBody as OpenAPIV3.RequestBodyObject;
  let bodyModel = undefined;
  const contentTypeList = Object.keys(requestBody?.content ?? {});
  if (requestBody?.content?.[contentTypeList[0]]?.schema) {
    const schema = requestBody.content[contentTypeList[0]].schema;
    bodyModel = typeMetadataFromSchemaObject(componentObject, schema);
  }
  typeReferenceList.push(bodyModel)


  const queryParameters = operationObjectExtractQueryParameters(operationObject);
  let rootUrlTemplate = url.split("{").join("${");
  const pathParameters = urlExtractPathParameters(rootUrlTemplate);

  const response = responseMetadataFromResponsesObject(componentObject, operationObject.responses);
  typeReferenceList.push(...(response?.typeReferenceList ?? []));
  return {
    method: method,
    requestPath: rootUrlTemplate,
    dependencyList: typeReferenceList.filter(e => e),
    body: bodyModel,
    hasBody: Boolean(operationObject?.requestBody),
    operationName: operationId,
    controllerName: controllerName,
    pathParameters: {
      metadataType: "object",
      children: [
        ...(pathParameters?.children ?? []),
      ],
      references: [
        ...(pathParameters?.references ?? []),
      ]
    },
    queryParameters: {
      metadataType: "object",
      children: [
        ...(queryParameters?.children ?? []),
      ],
      references: [
        ...(queryParameters?.references ?? []),
      ]
    },
    isRequestType: {
      applicationJson: "application/json" === contentTypeList[0],
      multipartFormData: "multipart/form-data" === contentTypeList[0],
    },
    response: response,
  }
};

const toPascalCase = (string: string) => {
  if (string.includes("-")) {
    return kebabCaseToPascalCase(string)
  }
  return string;
}

const kebabCaseToPascalCase = str =>
  str.toLowerCase().replace(/^.|([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '_')
  );