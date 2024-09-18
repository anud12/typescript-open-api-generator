import {describe, expect, test} from "@jest/globals";
import {DirectoryMetadata} from "../../src/storage/directoryMetadata";


describe("fileExist", () => {
  test("should return false if not exist", () => {
    const root = new DirectoryMetadata();
    const childDirectoryMetadata = root
      .newChildDirectoryMetadata("childDirectory")
      .newChildDirectoryMetadata("grandChildDirectory");

    const result = childDirectoryMetadata.fileExists("any");

    expect(result).toBeFalsy();
  });

  test("should return true if exist", () => {
    const root = new DirectoryMetadata();
    const childDirectoryMetadata = root
      .newChildDirectoryMetadata("childDirectory")
      .newChildDirectoryMetadata("grandChildDirectory");

    const result = childDirectoryMetadata.fileExists("grandChildDirectory");

    expect(result).toBeFalsy();
  });
});