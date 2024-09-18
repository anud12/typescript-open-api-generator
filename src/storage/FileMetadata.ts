export type FileMetadata =  {
  data:() => string,
  childDirectoryNames: Array<string>,
  name:string,
}