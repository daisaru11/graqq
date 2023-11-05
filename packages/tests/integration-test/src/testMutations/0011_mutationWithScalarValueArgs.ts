/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ResultOf } from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $m } from "../graqq.gen";

export const mutation = $m("TestMutation")({
  mutationWithNonNullStringArg: {
    $args: {
      arg: {
        value: "test",
      },
    },
    field1: true,
  },
});

const testResultType: Assert<
  ResultOf<typeof mutation>,
  {
    mutationWithNonNullStringArg: {
      __typename: "ObjectB";
      field1: string | null;
    };
  }
> = true;

export const expectedQuery = `\
mutation TestMutation {
  mutationWithNonNullStringArg(arg: "test") {
    __typename
    field1
  }
}`;
