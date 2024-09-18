import {describe, expect, test} from "@jest/globals";
import {DirectoryMetadata} from "../../src/storage/directoryMetadata";


describe("getRoot", () => {
  test("getRoot", () => {
    const parent = new DirectoryMetadata();
    const child = parent.newChildDirectoryMetadata("child")
      .newChildDirectoryMetadata("grandChild")
      .newChildDirectoryMetadata("grandGrandChild");
    expect(child.getRoot()).toBe(parent);
  })
})