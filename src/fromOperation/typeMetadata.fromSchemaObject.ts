import {OpenAPIV3} from "openapi-types";
import {
  ArrayType,
  BlobType,
  EnumType,
  ObjectType,
  ObjectTypeChild,
  PrimitiveType,
  ReferenceType,
  StringType,
  TypeMetadata
} from "./typeMetadata.type";

export const typeMetadataFromSchemaObject = (componentObject: OpenAPIV3.ComponentsObject, schemaObject: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject): TypeMetadata => {
  if ("$ref" in schemaObject) {
    return refCase(componentObject, schemaObject);
  }
  switch (schemaObject.type) {
    case "object": {
      return objectCase(componentObject, schemaObject);
    }
    case "array": {
      return arrayCase(componentObject, schemaObject)
    }
    case "string": {
      schemaObject.type
      return stringCase(schemaObject)
    }
    case "integer":
    case "number": {
      return {
        metadataType: "primitive",
        type: "number"
      }
    }
    case "boolean": {
      return {
        metadataType: "primitive",
        type: "boolean"
      }
    }
  }
}

const refCase = (componentObject: OpenAPIV3.ComponentsObject, schemaObject: OpenAPIV3.ReferenceObject): ReferenceType | PrimitiveType => {
  const name = schemaObject.$ref.split("/").reverse()?.[0];
  const referencedSchemaObject = componentObject.schemas[name];
  if (!referencedSchemaObject) {
    return {
      metadataType: "primitive",
      type: "unknown"
    };
  }
  return {
    metadataType: "reference",
    type: name
  }
}

const createObjectTypeChild = <T extends TypeMetadata>(name: string, isOptional: boolean, data: T): ObjectTypeChild<T> => {
  return {
    name: name,
    isOptional: isOptional ? true : undefined,
    ...data,
  }
}

const objectCase = (componentObject: OpenAPIV3.ComponentsObject, schemaObject: OpenAPIV3.SchemaObject): ObjectType => {
  const children: Array<ObjectTypeChild> = Object.entries(schemaObject.properties ?? {})
    .map(([key, value]) => {
      const data: TypeMetadata = typeMetadataFromSchemaObject(componentObject, value);
      const result: ObjectTypeChild = createObjectTypeChild(key, schemaObject.nullable, data);
      if (schemaObject?.required && !schemaObject.required.includes(key)) {
        result.isOptional = true
      }
      return data ? result : undefined
    })
    .filter(value => value);

  const references = new Set<string>();
  children.forEach((value) => {
    if (!value) {
      return;
    }
    if (value.metadataType === "reference") {
      references.add(value.type)
    }
    if (value.metadataType === "array" || value.metadataType === "object") {
      value.references.forEach(ref => references.add(ref));
    }
  })
  return {
    metadataType: "object",
    references: [...references],
    children: children
  }
}

const arrayCase = (componentObject: OpenAPIV3.ComponentsObject, schemaObject: OpenAPIV3.ArraySchemaObject): ArrayType => {
  const itemsMetadata = typeMetadataFromSchemaObject(componentObject, schemaObject.items);
  let references: Array<string> = [];
  let type = "unknown /*maybe inline object*/";
  if (itemsMetadata.metadataType === "reference") {
    type = itemsMetadata.type;
    references = [itemsMetadata.type]
  }
  if (itemsMetadata.metadataType === "primitive") {
    type = itemsMetadata.type;
  }
  if (itemsMetadata.metadataType === "enum") {
    type = itemsMetadata.childrem.map(e => `"${e}"`).join(" | ");
  }
  return {
    metadataType: "array",
    references: references,
    type: `Array<${type}>`
  }
}

const stringCase = (schemaObject: OpenAPIV3.NonArraySchemaObject): BlobType | StringType | EnumType => {
  if (schemaObject.enum) {
    return {
      metadataType: "enum",
      childrem: schemaObject.enum
    }
  }
  if (schemaObject.format === "binary") {
    return {
      metadataType: "primitive",
      type: "Blob",
    }
  }

  return {
    metadataType: "primitive",
    type: "string"
  }
}