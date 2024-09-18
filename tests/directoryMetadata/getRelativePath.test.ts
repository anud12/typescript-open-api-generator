import {describe, expect, test} from "@jest/globals";
import {DirectoryMetadata} from "../../src/storage/directoryMetadata";


describe("getRelativePath", () => {
  test("to root", () => {
    const parent = new DirectoryMetadata();
    const child = parent.newChildDirectoryMetadata("child")
      .newChildDirectoryMetadata("grandChild")
      .newChildDirectoryMetadata("grandGrandChild");
    expect(parent.getStringPathTo(child)).toEqual("child/grandChild/grandGrandChild")
  })

  test("from root", () => {
    const parent = new DirectoryMetadata();
    const child = parent.newChildDirectoryMetadata("child")
      .newChildDirectoryMetadata("grandChild")
      .newChildDirectoryMetadata("grandGrandChild");
    expect(child.getStringPathTo(parent)).toEqual("../../..")
  })

  test("to 2nd cousin", () => {
    const parent = new DirectoryMetadata();
    const firstChild = parent.newChildDirectoryMetadata("1")
      .newChildDirectoryMetadata("1-1")
      .newChildDirectoryMetadata("1-1-1");
    const secondChild = parent.newChildDirectoryMetadata("2")
      .newChildDirectoryMetadata("2-2")
      .newChildDirectoryMetadata("2-2-2");
    expect(secondChild.getStringPathTo(firstChild)).toEqual("../../../1/1-1/1-1-1")
  })

  test("not found", () => {
    const parent = new DirectoryMetadata();
    const child = parent.newChildDirectoryMetadata("child")
      .newChildDirectoryMetadata("grandChild")
      .newChildDirectoryMetadata("grandGrandChild");
    expect(child.getStringPathTo(new DirectoryMetadata())).toEqual(undefined)
  })

  test("to middle", () => {
    const child = new DirectoryMetadata()
      .newChildDirectoryMetadata("child")
      .newChildDirectoryMetadata("grandChild")
      .newChildDirectoryMetadata("grandGrandChild");
    expect(child.getStringPathTo(child.parentDirectory.parentDirectory)).toEqual("../..")
  })
})