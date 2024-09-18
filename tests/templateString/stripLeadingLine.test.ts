import {templateString} from "../../src/generator/helper/templateString";
import {describe, expect, test} from "@jest/globals";
import * as path from "path";

const testCase = () => templateString("")`
hello

world`;

const expected = `hello

world`

describe(path.basename(__dirname), () => {
  test(path.basename(__filename), () => {
    const result = testCase();
    expect(result).toEqual(expected);
  })
})