import {OpenAPIV3} from "openapi-types";
import {templateString} from "../helper/templateString";
import {Template} from "./template.type";
import {ObjectType, TypeMetadata} from "../../fromOperation/typeMetadata.type";

export const typeDefinitionTemplateInline = (...args: Parameters<typeof typeDefinitionTemplate>): ReturnType<typeof typeDefinitionTemplate> => {
  const result = typeDefinitionTemplate(...args);

  return () => {
    const objectBegin = "";
    const objectEnd = "";
    const body = result()
      .split("\n")
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .join(" ");
    return `${objectBegin}${body}${objectEnd}`
  }
}

export const typeDefinitionTemplate = (componentObject: OpenAPIV3.ComponentsObject, model?: TypeMetadata): Template => {
  if (!model) {
    return () => "unknown";
  }
  switch (model.metadataType) {
    default:
      return () => model.type;
    case "object":
      return () => {
        if (model.children.length === 0) {
          return `{}`;
        }
        return templateString()`{
        ${model.children.map(e => templateString("  ")`
          ${e.name}${e.isOptional ? "?" : ""}: ${typeDefinitionTemplate(componentObject, e)()},
        `).join("\n")}
        }`
      };
    case "enum":
      return () => {
        return model.childrem.map(string => `"${string}"`).join(" | ");
      }
    case "union":
      return () => {
        if (model.subtypes.length === 0) {
          return `never`
        }
        const objectType = model.subtypes.filter((e): e is ObjectType => e.metadataType === "object").reduce((acc, e) => {
          acc.children.push(...e.children)
          acc.references.push(...e.references)
          return acc;
        }, {
          metadataType: "object",
          children: [],
          references: []
        } satisfies ObjectType);

        const list = [objectType, ...model.subtypes.filter(e => e?.metadataType !== "object")].filter(e => e);
        return templateString("")`${list.map(e => typeDefinitionTemplate(componentObject, e)()).join(" & ")}`
      }
  }
};