import { buildSchema, print, validate, type GraphQLSchema } from "graphql";
import { assert, describe, it } from "vitest";

import * as fs from "fs";
import * as path from "path";

import { mutationSimple0, mutationWithArgs0 } from "./testMutations";

const loadSchema = async (schemaPath: string): Promise<GraphQLSchema> => {
  const schemaBody = (await fs.promises.readFile(schemaPath)).toString();
  return buildSchema(schemaBody);
};

describe("queries", async () => {
  const schema = await loadSchema(path.resolve("schema.graphql"));

  const testCases = [
    {
      queryNode: mutationSimple0,
      expectedQuery: `\
mutation AddComment {
  addComment(input: {articleId: "testId", body: "testBody"}) {
    comment {
      id
      body
    }
  }
}`,
    },
    {
      queryNode: mutationWithArgs0,
      expectedQuery: `\
mutation AddComment($input: AddCommentInput!) {
  addComment(input: $input) {
    comment {
      id
      body
    }
  }
}`,
    },
  ];

  it("creates a valid document node", () => {
    for (const testCase of testCases) {
      assert.equal(print(testCase.queryNode), testCase.expectedQuery);
      assert.isEmpty(validate(schema, testCase.queryNode));
    }
  });
});
