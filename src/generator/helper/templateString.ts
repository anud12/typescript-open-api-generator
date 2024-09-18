import dedent from "ts-dedent";


export const templateString = Object.assign((identation?: string) => (templates: string | TemplateStringsArray, ...values: any[]): string => {
  const filteredValues = values
    .map(e => e === undefined ? templateString.clearLine : e)
    .map(e => e?.length === 0 ? templateString.clearLine : e)
    .map(e => e === false ? templateString.clearLine : e);

  let result:string | string[] = dedent(templates, ...filteredValues)
  result = result.split("\n")
  result = result.map(string => string.trimEnd())
  result = result.join("\n")
  result = removeLeadingEmptyLines(result);
  result = removeTrailingEmptyLines(result);

  if (result.trim() === templateString.clearLine) {
    return undefined;
  }
  result = removeClearSymbol(result);

  result = result.replace(/\n\n\n/, "\n\n")
  result = result.split("\n").map(e => `${identation ?? ""}${e}`).join("\n");

  return result
}, {
  clearLine: "__clear__"
})


const removeClearSymbol = (result:string):string => {

  const regexLineContainingOnlyClear = /\s*__clear__\n/;
  while (result.search(regexLineContainingOnlyClear) !== -1) {
    result = result.replace(regexLineContainingOnlyClear, "\n")
  }
  while (result.search("__clear__") !== -1) {
    result = result.replace("__clear__", "")
  }
  return result;
}

const removeTrailingEmptyLines = (result:string):string => {
  let lines = result.split("\n")
  lines = lines.reverse();
  while(lines.length !== 0 && lines[0].length === 0) {
    lines.shift();
  }
  lines = lines.reverse();
  return lines.join("\n");
}
const removeLeadingEmptyLines = (result:string):string => {
  let lines = result.split("\n")
  while(lines.length !== 0 && lines[0].length === 0) {
    lines.shift();
  }
  return lines.join("\n");
}
