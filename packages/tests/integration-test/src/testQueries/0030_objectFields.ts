/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ResultOf } from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $q } from "../graqq.gen";

export const query = $q("TestQuery")({
  query: {
    nullableObject: {
      field1: true,
    },
    nonNullObject: {
      field1: true,
    },
  },
});

const testResultType: Assert<
  ResultOf<typeof query>,
  {
    query: {
      __typename: "ObjectA";
      nullableObject: {
        __typename: "ObjectB";
        field1: string | null;
      } | null;
      nonNullObject: {
        __typename: "ObjectB";
        field1: string | null;
      };
    };
  }
> = true;

export const expectedQuery = `\
query TestQuery {
  query {
    __typename
    nullableObject {
      __typename
      field1
    }
    nonNullObject {
      __typename
      field1
    }
  }
}`;
