export type PrimitiveType<T = string> = {
  metadataType: "primitive",
  type: T
}

export type BooleanType = PrimitiveType<"boolean">
export type NumberType = PrimitiveType<"number">
export type StringType = PrimitiveType<"string">
export type BlobType = PrimitiveType<"Blob">

export type ArrayType = {
  metadataType: "array",
  references: Array<string>,
  type: string
}

export type EnumType = {
  metadataType:"enum",
  childrem: Array<string>,
}

export type ObjectTypeChild<T extends TypeMetadata = TypeMetadata> = T & {
  name: string,
  isOptional?: boolean
};

export type ObjectType = {
  metadataType: "object",
  references: Array<string>,
  children: Array<ObjectTypeChild>
}

export type ReferenceType = {
  metadataType: "reference",
  type: string,
}

export type UnionType = {
  metadataType: "union",
  subtypes: Array<TypeMetadata>,
}

export type TypeMetadata = PrimitiveType
  | NumberType
  | BooleanType
  | StringType
  | BlobType
  | ObjectType
  | ArrayType
  | ReferenceType
  | EnumType
  | UnionType