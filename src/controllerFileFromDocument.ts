import {OpenAPIV3} from "openapi-types";
import {operationMetadataFromOperation} from "./fromOperation/operationMetadata.fromOperation";
import {controllerMetadataFromOperationList} from "./fromOperation/controllerMetadata.fromOperationList";
import {controllerMetadataGenerator} from "./generator/controllerMetadata.generator";
import {DirectoryMetadata} from "./storage/directoryMetadata";
import {Options} from "./index";

export const controllerFileFromDocument = (paths: OpenAPIV3.PathsObject, components: OpenAPIV3.ComponentsObject, args:Options): DirectoryMetadata => {
  const operationList = Object.entries(paths)
    .flatMap(([url, parsedPath]: [string, OpenAPIV3.OperationObject]) => {
      return [
        "GET",
        "HEAD",
        "POST",
        "PUT",
        "DELETE",
        "CONNECT",
        "OPTIONS",
        "TRACE",
        "PATCH",
      ].map(method => {
        return parsedPath?.[method.toLowerCase()] && operationMetadataFromOperation(url, method, parsedPath?.[method.toLowerCase()], components)
      })
    })
    .filter(value => value);

  const controllerNames = operationList
    .reduce((previous, current) => {
      if (current?.controllerName) {
        previous.add(current.controllerName)
      }
      return previous;
    }, new Set<string>());
  const directoryMetadata = new DirectoryMetadata();
  const controllerList = [...controllerNames].map(value => {
    return controllerMetadataFromOperationList(value, components, operationList);
  })
  controllerList.forEach(value => {
    controllerMetadataGenerator(components, directoryMetadata, args, value)
  });

  return directoryMetadata;
}