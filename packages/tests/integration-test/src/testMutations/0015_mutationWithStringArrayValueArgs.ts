/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ResultOf } from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $m } from "../graqq.gen";

export const mutation = $m("TestMutation")({
  mutationWithNullableStringNullableArrayArg: {
    $args: {
      arg: {
        value: ["test1", "test2"],
      },
    },
    field1: true,
  },
});

const testResultType: Assert<
  ResultOf<typeof mutation>,
  {
    mutationWithNullableStringNullableArrayArg: {
      field1: string | null;
    };
  }
> = true;

export const expectedQuery = `\
mutation TestMutation {
  mutationWithNullableStringNullableArrayArg(arg: ["test1", "test2"]) {
    field1
  }
}`;
