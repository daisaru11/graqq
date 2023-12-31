/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ResultOf } from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $q } from "../graqq.gen";

export const query = $q("TestQuery")({
  query: {
    nonNullString: false,
    nonNullInt: true,
  },
});

const testResultType: Assert<
  ResultOf<typeof query>,
  {
    query: {
      __typename: "ObjectA";
      nonNullInt: number;
    };
  }
> = true;

export const expectedQuery = `\
query TestQuery {
  query {
    __typename
    nonNullInt
  }
}`;
