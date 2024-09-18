import {describe, expect, test} from "@jest/globals";
import {templateString} from "../../src/generator/helper/templateString";
import * as path from "path";


const testCase = () => templateString()`${templateString.clearLine}`;

const expected = undefined

describe(path.basename(__dirname), () => {
  test(path.basename(__filename), () => {
    const result = testCase();
    expect(result).toEqual(expected);
  })
})
