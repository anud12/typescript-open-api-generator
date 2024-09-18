import {OpenAPIV3} from "openapi-types";
import {OperationMetadata} from "../../fromOperation/operationMetadata.fromOperation";
import {typeDefinitionTemplate} from "./typeDefinition.template";
import {templateString} from "../helper/templateString";
import {typeMetadataCreateUnion} from "../../fromOperation/typeMetadataCreateUnion";

export const urlBuilderTemplate = (componentObject: OpenAPIV3.ComponentsObject, model?: OperationMetadata) => {
  const parameters = model.pathParameters.children.length || model.queryParameters.children.length ?
    typeDefinitionTemplate(componentObject, typeMetadataCreateUnion(model.pathParameters, model.queryParameters))()
    : undefined;

  return templateString()`
  const urlBuilder = (${parameters && templateString("  ")`parameters: ${parameters}`.trimStart()}) => {
    ${model.pathParameters.children.map(e => templateString("")`
    const ${e.name} = parameters.${e.name};
    `).join("\n")}
    ${!!model.queryParameters.children.length && templateString()`
    const query = [];
    `}
    ${model.queryParameters.children.filter(query => !query.isOptional).map(query => templateString()`
    query.push(\`${query.name}=\${parameters.${query.name}}\`);
    `).join("\n")}
    ${model.queryParameters.children.filter(query => query.isOptional).map(query => templateString()`
    if(parameters.${query.name} !== undefined && parameters.${query.name} !== null) {
      query.push(\`${query.name}=\${parameters.${query.name}}\`);
    }`).join("\n")}
    ${!!model.queryParameters.children.length && templateString()`
    if(query.length) {
      return \`${model.requestPath}?\${query.join("&")}\`; 
    }`}
    return \`${model.requestPath}\`;
  }
  `
}