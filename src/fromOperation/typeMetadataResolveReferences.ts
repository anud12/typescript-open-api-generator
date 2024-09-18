import {OpenAPIV3} from "openapi-types";
import {TypeMetadata} from "./typeMetadata.type";
import {typeMetadataFromSchemaObject} from "./typeMetadata.fromSchemaObject";

export const typeMetadataResolveReferences = (componentObject: OpenAPIV3.ComponentsObject, typeMetadataList: Array<TypeMetadata | undefined>): Array<{ name: string, typeMetadata: TypeMetadata }> => {
  const resolvedTypeNames = new Map<string, TypeMetadata>();
  let unresolvedTypes = typeMetadataList;

  while (unresolvedTypes.length > 0) {
    const iterationList = [...unresolvedTypes];
    unresolvedTypes = [];
    iterationList.forEach(typeMetadata => {
      if (!typeMetadata) {
        return;
      }
      if (typeMetadata.metadataType === "reference") {
        if (!resolvedTypeNames.has(typeMetadata.type)) {
          const resolvedMetadata = typeMetadataFromComponent(componentObject, typeMetadata.type);
          resolvedTypeNames.set(typeMetadata.type, resolvedMetadata);
          unresolvedTypes.push(resolvedMetadata)
        }
      }
      if (typeMetadata.metadataType === "object") {
        typeMetadata.references.forEach(reference => {
          if (!resolvedTypeNames.has(reference)) {
            const resolvedMetadata = typeMetadataFromComponent(componentObject, reference);
            resolvedTypeNames.set(reference, resolvedMetadata);
            unresolvedTypes.push(resolvedMetadata);
          }
        });
      }
      if (typeMetadata.metadataType === "array") {
        typeMetadata.references.forEach(reference => {
          if (!resolvedTypeNames.has(reference)) {
            const resolvedMetadata = typeMetadataFromComponent(componentObject, reference);
            resolvedTypeNames.set(reference, resolvedMetadata);
            unresolvedTypes.push(resolvedMetadata);
          }
        });
      }
    })
  }

  return [...resolvedTypeNames.entries()].reverse().reduce((acc, [name, typeMetadata]) => {
    acc.push({name, typeMetadata})
    return acc;
  }, [] as Array<{ name:string, typeMetadata:TypeMetadata }>);
}

const typeMetadataFromComponent = (componentObject: OpenAPIV3.ComponentsObject, name: string): TypeMetadata | undefined => {
  const schemaChild = componentObject.schemas?.[name];
  if (!schemaChild) {
    return undefined;
  }
  return typeMetadataFromSchemaObject(componentObject, schemaChild);
}

