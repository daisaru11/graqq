/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ResultOf } from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $m } from "../graqq.gen";

export const mutation = $m("TestMutation")({
  mutation: {
    nullableString: true,
  },
});

const testResultType: Assert<
  ResultOf<typeof mutation>,
  {
    mutation: {
      __typename: "ObjectA";
      nullableString: string | null;
    };
  }
> = true;

export const expectedQuery = `\
mutation TestMutation {
  mutation {
    __typename
    nullableString
  }
}`;
