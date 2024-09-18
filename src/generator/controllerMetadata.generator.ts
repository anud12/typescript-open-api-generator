import {OpenAPIV3} from "openapi-types";
import {ControllerMetadata} from "../fromOperation/controllerMetadata.fromOperationList";
import {DirectoryMetadata} from "../storage/directoryMetadata";
import {operationMetadataGenerator} from "./operationMetadata.generator";
import {Options} from "../index";

export const controllerMetadataGenerator = (componentObject: OpenAPIV3.ComponentsObject, directoryMetadata: DirectoryMetadata, args:Options, model: ControllerMetadata) => {
  model.operations.map(value => {
    operationMetadataGenerator(componentObject, directoryMetadata,args, value);
  })
}