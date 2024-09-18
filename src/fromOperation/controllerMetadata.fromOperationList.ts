import {OperationMetadata} from "./operationMetadata.fromOperation";
import {OpenAPIV3} from "openapi-types";
import {typeMetadataResolveReferences} from "./typeMetadataResolveReferences";
import {TypeMetadata} from "./typeMetadata.type";

export type ControllerMetadata = {
  name: string,
  operations: Array<OperationMetadata>,
  typeDefinitions: Array<ControllerMetadataTypeDefinitions>,
}

export type ControllerMetadataTypeDefinitions = {
  typeMetadata: TypeMetadata,
  name: string
}

export const controllerMetadataFromOperationList = (
  name: string,
  componentObject: OpenAPIV3.ComponentsObject,
  operationMetadataList: Array<OperationMetadata>,
): ControllerMetadata => {
  const operations = operationMetadataList.filter(value => value?.controllerName === name);
  const typeReferences = operations.flatMap(operations => [
    ...operations.dependencyList,
  ]);
  const typeDefinitions = typeMetadataResolveReferences(componentObject, typeReferences);
  operations?.[0]?.response?.requestResult && typeDefinitions.push({
    typeMetadata: operations[0].response.requestResult,
    name: "RequestResult<T>"
  })
  return {
    name,
    operations,
    typeDefinitions: typeDefinitions,
  };
}