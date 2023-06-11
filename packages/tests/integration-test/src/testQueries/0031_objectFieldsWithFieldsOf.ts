/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ResultOf } from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $fieldsOf, $q } from "../graqq.gen";

const objectBFields1 = $fieldsOf("ObjectB")({
  field1: true,
  field2: true,
});
const objectBFields2 = $fieldsOf("ObjectB")({
  field2: true,
  field3: true,
});

export const query = $q("TestQuery")({
  query: {
    nullableObject: {
      ...objectBFields1,
    },
    nonNullObject: {
      ...objectBFields2,
    },
  },
});

const testResultType: Assert<
  ResultOf<typeof query>,
  {
    query: {
      nullableObject: {
        field1: string | null;
        field2: number;
      } | null;
      nonNullObject: {
        field2: number;
        field3: boolean | null;
      };
    };
  }
> = true;

export const expectedQuery = `\
query TestQuery {
  query {
    nullableObject {
      field1
      field2
    }
    nonNullObject {
      field2
      field3
    }
  }
}`;
