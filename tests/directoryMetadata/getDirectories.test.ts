import {describe, expect, test} from "@jest/globals";
import {DirectoryMetadata} from "../../src/storage/directoryMetadata";


describe("getDirectories", () => {
  test("should return directories that match the path", () => {
    const root = new DirectoryMetadata();
    const matchingDirectory = root.newChildDirectoryMetadata("matchingDirectory");
    matchingDirectory.newChildDirectoryMetadata("grandChildDirectory");
    const nonMatchingDirectory = root.newChildDirectoryMetadata("nonMatchingDirectory");
    nonMatchingDirectory.newChildDirectoryMetadata("grandChildDirectory");

    const directories = root.getDirectories("matchingDirectory/");

    expect(directories).toContain(matchingDirectory._name);
    expect(directories).not.toContain(nonMatchingDirectory._name);
  });
});