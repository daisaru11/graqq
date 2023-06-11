import { buildSchema, print, validate, type GraphQLSchema } from "graphql";
import { assert, describe, it } from "vitest";

import * as fs from "fs";
import * as path from "path";

import { testCases } from "./testQueries";

const loadSchema = async (schemaPath: string): Promise<GraphQLSchema> => {
  const schemaBody = (await fs.promises.readFile(schemaPath)).toString();
  return buildSchema(schemaBody);
};

describe("queries", async () => {
  const schema = await loadSchema(path.resolve("schema.graphql"));

  const testCaseNames = Object.keys(testCases) as Array<keyof typeof testCases>;

  for (const testCaseName of testCaseNames) {
    const testCase = testCases[testCaseName];

    it(`creates a valid document node: ${testCaseName}`, () => {
      assert.equal(print(testCase.query), testCase.expectedQuery);
      assert.isUndefined(validate(schema, testCase.query)[0]);
    });
  }
});
