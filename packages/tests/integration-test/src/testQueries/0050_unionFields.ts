/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ResultOf } from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $q } from "../graqq.gen";

export const query = $q("TestQuery")({
  query: {
    nullableUnion: {
      $on: {
        ObjectB: {
          field1: true,
        },
        ObjectC: {
          fieldA: true,
        },
      },
    },
    nonNullUnion: {
      $on: {
        ObjectB: {
          field2: true,
        },
        ObjectC: {
          fieldB: true,
        },
      },
    },
  },
});

const testResultType: Assert<
  ResultOf<typeof query>,
  {
    query: {
      __typename: "ObjectA";
      nullableUnion:
        | {
            __typename: "ObjectB";
            field1: string | null;
          }
        | {
            __typename: "ObjectC";
            fieldA: string | null;
          }
        | null;
      nonNullUnion:
        | {
            __typename: "ObjectB";
            field2: number;
          }
        | {
            __typename: "ObjectC";
            fieldB: number;
          };
    };
  }
> = true;

export const expectedQuery = `\
query TestQuery {
  query {
    __typename
    nullableUnion {
      __typename
      ... on ObjectB {
        field1
      }
      ... on ObjectC {
        fieldA
      }
    }
    nonNullUnion {
      __typename
      ... on ObjectB {
        field2
      }
      ... on ObjectC {
        fieldB
      }
    }
  }
}`;
