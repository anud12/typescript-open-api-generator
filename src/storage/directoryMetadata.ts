import {FileMetadata} from "./FileMetadata";

export type DirectoryFileMetadata = {
  name: string,
  parentDirectory: DirectoryMetadata,
  data: () => string,
  getStringPathToRoot: () => string
}

export class DirectoryMetadata {
  _name?: string | undefined;
  parentDirectory?: DirectoryMetadata
  nameByFile: Map<DirectoryFileMetadata, string> = new Map()
  nameByDirectory: Map<DirectoryMetadata, string> = new Map()

  withParentDirectory = (parentDirectory: DirectoryMetadata): DirectoryMetadata => {
    this.parentDirectory = parentDirectory;
    return this
  }

  persistFile = (fileMetadata: FileMetadata): DirectoryFileMetadata => {
    return this.insertFileToDirectory(fileMetadata.childDirectoryNames, fileMetadata);
  }

  createOrGetFile = (name: string, data: () => string): DirectoryFileMetadata => {
    const file = [...this.nameByFile.entries()].find(([_, fileName]) => fileName === name);
    if (file) {
      return file[0];
    }
    return this.persistFile({
      name,
      data,
      childDirectoryNames: [],
    })
  }

  createFile = (name: string, data: () => string): DirectoryFileMetadata => {
    return this.persistFile({
      name,
      data,
      childDirectoryNames: [],
    })
  }
  getAllFilesRecursively = (): Array<DirectoryFileMetadata> => {
    const files = [...this.nameByFile.keys()];
    const childFiles = [...this.nameByDirectory.keys()].flatMap((directory) => {
      return directory.getAllFilesRecursively()
    })

    return [...files, ...childFiles];
  }

  insertFileToDirectory = (childDirectoryNames: Array<string>, fileMetadata: FileMetadata) => {
    if (childDirectoryNames.length === 0) {
      const file: DirectoryFileMetadata = {
        name: fileMetadata.name,
        parentDirectory: this,
        data: fileMetadata.data,
        getStringPathToRoot: () => `${this.getStringPathToRoot()}${fileMetadata.name}`
      }
      this.nameByFile.set(file, fileMetadata.name);
      return file;
    }
    const [first, ...rest] = childDirectoryNames;
    let [directory, _] = [...this.nameByDirectory.entries()]
      .find(([_, name]) => name === first) ?? [];
    if (!directory) {
      directory = this.newChildDirectoryMetadata(first);
    }
    return directory.insertFileToDirectory(rest, fileMetadata);
  }

  newChildDirectoryMetadata = (name) => {
    let directoryMetadata = new DirectoryMetadata()
      .withParentDirectory(this);
    directoryMetadata._name = name;
    this.nameByDirectory.set(directoryMetadata, name)
    return directoryMetadata
  }
  findDirectoryInChildren = (target: DirectoryMetadata, excludeDirectory?: DirectoryMetadata): DirectoryMetadata | undefined => {
    return [...this.nameByDirectory.entries()].reduce((acc: DirectoryMetadata | undefined, [directoryMetadata, _]) => {
      if (acc) {
        return acc;
      }
      if (directoryMetadata === excludeDirectory) {
        return acc;
      }

      const directory = directoryMetadata.nameByDirectory.get(target);
      if (directory) {
        return target;
      }
      return directoryMetadata.findDirectoryInChildren(target);
    }, undefined)
  }
  getRoot = (): DirectoryMetadata => {
    if (!this.parentDirectory) {
      return this;
    }
    return this.parentDirectory.getRoot();
  }
  getStringPathToRoot = () => {
    return this.getStringPathTo(this.getRoot());
  }
  getStringPathTo = (target: DirectoryMetadata, excludeDirectory?: DirectoryMetadata) => {
    if (target === this) {
      return "./"
    }
    let path = this.findDirectoryInChildren(target, excludeDirectory);
    if (path) {
      return this.getRelativePathToChildren(target);
    }
    if (this.parentDirectory === undefined) {
      return undefined
    }
    const parentPath = this.parentDirectory.getStringPathTo(target, this);
    if (parentPath === undefined) {
      return undefined
    }
    if (parentPath === "./") {
      return "..";
    }
    return `../${parentPath}`;
  }
  private getRelativePathToChildren = (target: DirectoryMetadata, excludeDirectory?: DirectoryMetadata): string | undefined => {
    let directory = this.findDirectoryInChildren(target, excludeDirectory);
    if (!directory) {
      return undefined
    }

    let path = directory.parentDirectory?.nameByDirectory.get(directory);
    while (directory !== this && directory.parentDirectory?.nameByDirectory.get(directory) !== undefined) {
      directory = directory.parentDirectory;
      const name = directory.parentDirectory?.nameByDirectory.get(directory);
      if (name) {
        path = `${name}/${path}`;
      }
    }
    return path;
  }

  getDirectories(path: string) {
    // Filter out directories that do not match the provided path
    const directories = Array.from(this.nameByDirectory.keys()).filter(directory => {
      return directory.getStringPathToRoot().includes(path);
    });

    // Return the names of the matching directories
    return directories.map(directory => directory._name);
  }

  fileExists(fileName: string) {
    return [...this.nameByFile.keys()]
      .find(file => file.name === fileName) !== undefined;
  }

  readFile(fileName: string) {
    return [...this.nameByFile.keys()].find(file => file.name === fileName)?.data();
  }
}