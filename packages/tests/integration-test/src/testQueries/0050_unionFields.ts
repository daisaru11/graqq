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
      nullableUnion:
        | {
            field1: string | null;
          }
        | {
            fieldA: string | null;
          }
        | null;
      nonNullUnion:
        | {
            field2: number;
          }
        | {
            fieldB: number;
          };
    };
  }
> = true;

export const expectedQuery = `\
query TestQuery {
  query {
    nullableUnion {
      ... on ObjectB {
        field1
      }
      ... on ObjectC {
        fieldA
      }
    }
    nonNullUnion {
      ... on ObjectB {
        field2
      }
      ... on ObjectC {
        fieldB
      }
    }
  }
}`;
