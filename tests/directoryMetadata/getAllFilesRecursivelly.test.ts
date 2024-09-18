import {describe, expect, test} from "@jest/globals";
import {DirectoryMetadata} from "../../src/storage/directoryMetadata";


describe("getAllFilesRecursively", () => {
  test("getAllFilesRecursively", () => {
    const parent = new DirectoryMetadata();
    const firstChild = parent.newChildDirectoryMetadata("1")
      .newChildDirectoryMetadata("1-1")
      .newChildDirectoryMetadata("1-1-1");
    const secondChild = parent.newChildDirectoryMetadata("2")
      .newChildDirectoryMetadata("2-2")
      .newChildDirectoryMetadata("2-2-2");
    parent.createFile("parentFile", () => "");
    firstChild.createFile("firstChildFile", () => "");
    secondChild.createFile("secondChildFile", () => "");

    expect(parent.getAllFilesRecursively().map(e => e.name)).toEqual(["parentFile", "firstChildFile", "secondChildFile"])
  })

})