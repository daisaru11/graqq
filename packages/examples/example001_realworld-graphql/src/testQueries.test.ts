import { buildSchema, print, validate, type GraphQLSchema } from "graphql";
import { assert, describe, it } from "vitest";

import * as fs from "fs";
import * as path from "path";

import { querySimple0, queryWithArgs0 } from "./testQueries";

const loadSchema = async (schemaPath: string): Promise<GraphQLSchema> => {
  const schemaBody = (await fs.promises.readFile(schemaPath)).toString();
  return buildSchema(schemaBody);
};

describe("queries", async () => {
  const schema = await loadSchema(path.resolve("schema.graphql"));

  const testCases = [
    {
      queryNode: querySimple0,
      expectedQuery: `\
query Viewer {
  viewer {
    __typename
    user {
      __typename
      id
      bio
    }
  }
  tags
}`,
    },
    {
      queryNode: queryWithArgs0,
      expectedQuery: `\
query UserByUserName($uname: String!) {
  user(username: $uname) {
    __typename
    id
    bio
    favoriteArticles {
      __typename
      edges {
        __typename
        node {
          __typename
          id
          title
          createdAt
        }
      }
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
