/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ResultOf } from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $q } from "../graqq.gen";

export const query = $q("TestQuery")({
  query: {
    nonNullString: true as boolean, // true but non-literal field
  },
});

const testResultType: Assert<
  ResultOf<typeof query>,
  {
    query: {
      __typename: "ObjectA";
      nonNullString?: string;
    };
  }
> = true;

export const expectedQuery = `\
query TestQuery {
  query {
    __typename
    nonNullString
  }
}`;
