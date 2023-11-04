/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ResultOf } from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $q } from "../graqq.gen";

export const query = $q("TestQuery")({
  query: {
    nullableInterface: {
      field1: true,
      field2: true,
      field3: {
        field1: true,
      },
      $on: {
        ObjectE: {
          field4: true,
        },
      },
    },
    nonNullInterface: {
      field1: true,
      field2: true,
      field3: {
        field1: true,
      },
      $on: {
        ObjectF: {
          field4: true,
        },
      },
    },
  },
});

const testResultType: Assert<
  ResultOf<typeof query>,
  {
    query: {
      nullableInterface: {
        field1: string | null;
        field2: number;
        field3: {
          field1: string | null;
        } | null;
        field4: boolean;
      } | null;
      nonNullInterface: {
        field1: string | null;
        field2: number;
        field3: {
          field1: string | null;
        } | null;
        field4: number | null;
      };
    };
  }
> = true;

export const expectedQuery = `\
query TestQuery {
  query {
    nullableInterface {
      field1
      field2
      field3 {
        field1
      }
      ... on ObjectE {
        field4
      }
    }
    nonNullInterface {
      field1
      field2
      field3 {
        field1
      }
      ... on ObjectF {
        field4
      }
    }
  }
}`;
