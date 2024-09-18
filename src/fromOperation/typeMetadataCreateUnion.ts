import {TypeMetadata, UnionType} from "./typeMetadata.type";

export const typeMetadataCreateUnion = (...metadataList: Array<TypeMetadata>): UnionType => {
  return {
    metadataType: "union",
    subtypes: metadataList,
  };
}