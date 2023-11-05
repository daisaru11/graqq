/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ResultOf } from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $m } from "../graqq.gen";

export const mutation = $m("TestMutation")({
  mutationWithNullableStringArg: {
    $args: {
      arg: {
        value: null,
      },
    },
    field1: true,
  },
});

const testResultType: Assert<
  ResultOf<typeof mutation>,
  {
    mutationWithNullableStringArg: {
      __typename: "ObjectB";
      field1: string | null;
    };
  }
> = true;

export const expectedQuery = `\
mutation TestMutation {
  mutationWithNullableStringArg(arg: null) {
    __typename
    field1
  }
}`;
