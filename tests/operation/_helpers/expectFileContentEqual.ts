import {DirectoryMetadata} from "../../../src/storage/directoryMetadata";
import {expect, test} from "@jest/globals";
import dedent from "ts-dedent";

export const expectFileContentEqual = (operations: {
  path: string;
  data: () => string;
  parentDirectory: DirectoryMetadata;
  name: string;
  getStringPathToRoot: () => string
}[], fileData: string) => {
  operations.forEach((op) => {
    test(`File content equals: ${op.path}`, () => {
      const startPoint = fileData
        .split(`///Expected: ${op.path}\n/\*\n`)
      if (startPoint.length < 2) {
        throw Error(`"///Expected: ${op.path}\\n/\\*\\n" not found in test file`);
      }
      let body = startPoint[1].split("\n\*/\n///Expected-End")[0];
      if (!body) {
        throw Error(`\\n\\*/\\n///Expected-End no found in test file`);
      }

      expect(dedent(op.data())).toEqual(body)
    })
  })
}