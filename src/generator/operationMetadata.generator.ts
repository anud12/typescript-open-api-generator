import {OpenAPIV3} from "openapi-types";
import {OperationMetadata} from "../fromOperation/operationMetadata.fromOperation";
import {DirectoryMetadata} from "../storage/directoryMetadata";
import {templateString} from "./helper/templateString";
import {typeDefinitionTemplate} from "./template/typeDefinition.template";
import {bodyToFormDataTemplate, operationMetadataRequestTemplate} from "./template/operationMetadataRequest.template";
import {fetchTemplate} from "./template/fetch.template";
import {urlBuilderTemplate} from "./template/urlBuilder.template";
import {Options} from "../index";
import {typeMetadataResolveReferences} from "../fromOperation/typeMetadataResolveReferences";

export const operationMetadataGenerator = (componentObject: OpenAPIV3.ComponentsObject, directoryMetadata: DirectoryMetadata, args:Options, model: OperationMetadata) => {

  const fetcherFile = directoryMetadata.createOrGetFile("_fetcher.ts", fetchTemplate)

  const bodyToFormDataFile = model.isRequestType.multipartFormData && directoryMetadata.createOrGetFile("_bodyToFormData.ts", bodyToFormDataTemplate);
  directoryMetadata.createFile(`${args.prefix}${model.controllerName}_${model.operationName}.ts`, () => {
    return templateString()`
      import {fetcher} from "${fetcherFile.getStringPathToRoot().split(".ts")[0]}";
      ${model.isRequestType.multipartFormData && `import {bodyToFormData} from "${bodyToFormDataFile.getStringPathToRoot().split(".ts")[0]}";`}
      
      ${typeMetadataResolveReferences(componentObject, [...model.dependencyList])
      .map(e => `export type ${e.name} = ${typeDefinitionTemplate(componentObject, e.typeMetadata)()}`).join("\n\n")}
      
      ${urlBuilderTemplate(componentObject, model)}
      
      export const ${args.prefix}${model.controllerName}_${model.operationName} = ${operationMetadataRequestTemplate(componentObject, model)()}
      `;
  })
}
