import {describe} from "@jest/globals";
import * as fs from "fs";
import {controllerFileFromDocument} from "../../../src/controllerFileFromDocument";
import {expectFileContentEqual} from "./expectFileContentEqual";
import {expectFileDeclarationToExist} from "./expectFileDeclarationToExist";
import {DirectoryFileMetadata} from "../../../src/storage/directoryMetadata";


type DirectoryFileMetadataWithPath = DirectoryFileMetadata & {
  path: string
}

const buildOperationList = (paths, components) => {
  const documentMetadata= controllerFileFromDocument(paths, components, {
    prefix: "",
    inputFile: "",
    output: ""
  });
  const operations = documentMetadata.getAllFilesRecursively().map(file => ({
    ...file,
    path: file.parentDirectory.getStringPathTo(documentMetadata) + file.name
  })) as any;
  return {
    documentMetadata,
    operations
  };
}


function expectOperationListNotEmpty(operations: DirectoryFileMetadataWithPath[]) {
  if (operations.length <= 0) {
    throw Error("Operation length is less than 0 :" + operations.length);
  }
}

export const helper = {
  name: (__filename) => "Should controller files equal",
  test: (__filename, paths, components) => {
    let targetFileName = __filename.split("/");
    targetFileName.reverse();
    targetFileName = targetFileName[0] ?? ""
    const {operations} = buildOperationList(paths, components);
    const fileData = fs.readFileSync(__filename).toString();
    describe(`In ${targetFileName}`, () => {
      expectOperationListNotEmpty(operations);
      expectFileContentEqual(operations, fileData);
      expectFileDeclarationToExist(fileData, operations);
    })
  }
}
