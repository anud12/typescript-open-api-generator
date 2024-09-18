import {describe, expect, test} from "@jest/globals";
import {DirectoryMetadata} from "../../src/storage/directoryMetadata";

describe("createFile", () => {
  test("to root", () => {
    const parent = new DirectoryMetadata();
    const child = parent.newChildDirectoryMetadata("child")
      .newChildDirectoryMetadata("grandChild")
      .newChildDirectoryMetadata("grandGrandChild");
    const file = child.createFile("MyFile", () => "file data");
    expect(file.parentDirectory).toEqual(child)
  })
});