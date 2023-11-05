/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ResultOf } from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $m } from "../graqq.gen";

export const mutation = $m("TestMutation")({
  mutationWithNonNullInputObjectArg: {
    $args: {
      arg: {
        value: {
          field1: 5,
          field2: 1,
          field3: "test",
          field4: "E1",
        },
      },
    },
    field1: true,
  },
});

const testResultType: Assert<
  ResultOf<typeof mutation>,
  {
    mutationWithNonNullInputObjectArg: {
      __typename: "ObjectB";
      field1: string | null;
    };
  }
> = true;

export const expectedQuery = `\
mutation TestMutation {
  mutationWithNonNullInputObjectArg(
    arg: {field1: 5, field2: 1, field3: "test", field4: E1}
  ) {
    __typename
    field1
  }
}`;
