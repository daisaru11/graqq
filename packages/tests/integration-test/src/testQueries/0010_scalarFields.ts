/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ResultOf } from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $q } from "../graqq.gen";

export const query = $q("TestQuery")({
  query: {
    nullableString: true,
    nonNullString: true,
    nullableInt: true,
    nonNullInt: true,
    nullableFloat: true,
    nonNullFloat: true,
    nullableBoolean: true,
    nonNullBoolean: true,
  },
});

type A = ResultOf<typeof query>;
const testResultType: Assert<
  ResultOf<typeof query>,
  {
    query: {
      __typename: "ObjectA";
      nullableString: string | null;
      nonNullString: string;
      nullableInt: number | null;
      nonNullInt: number;
      nullableFloat: number | null;
      nonNullFloat: number;
      nullableBoolean: boolean | null;
      nonNullBoolean: boolean;
    };
  }
> = true;

export const expectedQuery = `\
query TestQuery {
  query {
    __typename
    nullableString
    nonNullString
    nullableInt
    nonNullInt
    nullableFloat
    nonNullFloat
    nullableBoolean
    nonNullBoolean
  }
}`;
