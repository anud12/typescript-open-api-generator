#!/usr/bin/env node

import * as SwaggerParser from "swagger-parser";
import * as fs from "fs";
import {writeFileSync} from "fs";
import {OpenAPIV3} from "openapi-types";
import {program} from "commander";
import {controllerFileFromDocument} from "./controllerFileFromDocument";

export type Options = {
  output: string,
  inputFile: string,
  prefix: string
}
const command = program.option("-o, --output <outputDirectory>", "Output directory", "./output")
  .option("--prefix <prefix>", "Operation name prefix", "")
  .argument("<string>", "Input OpenApi json file")
  .parse();

const args: Options = {
  ...command.opts<any>(),
  inputFile: command.args[0]
}
if (!command.args[0]) {
  process.exit(0);
}

fs.mkdirSync(args.output, {recursive: true});

SwaggerParser.parse(args.inputFile).then((parsed) => {
  const components = (parsed as any).components as OpenAPIV3.ComponentsObject
  const paths = (parsed.paths) as OpenAPIV3.PathsObject
  let fileList = controllerFileFromDocument(paths, components, args);
  fileList.getAllFilesRecursively().map((file) => {
    writeFileSync(`${args.output}/${file.getStringPathToRoot()}`, file.data())
  })
})