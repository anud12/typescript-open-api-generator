import {DirectoryMetadata} from "../../../src/storage/directoryMetadata";
import {expect, test} from "@jest/globals";

export const expectFileDeclarationToExist = (fileData: string, operations: {
  path: string;
  data: () => string;
  parentDirectory: DirectoryMetadata;
  name: string;
  getStringPathToRoot: () => string
}[]) => {
  const declaredFiles = [...fileData.matchAll(/\/\/\/Expected: .*/g)].flatMap(regExprMatchArray => [...regExprMatchArray])
    .map(string => string.split("///Expected: ")[1]);
  declaredFiles.forEach(declaredFile => {
    test(`File content exists: ${declaredFile}`, () => {
      expect(operations.find(op => op.path === declaredFile)).toBeTruthy();
    })
  })
}