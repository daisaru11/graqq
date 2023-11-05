/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ResultOf } from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $m } from "../graqq.gen";

export const mutation = $m("TestMutation")({
  mutationWithNullableInputObjectNonNullArrayArg: {
    $args: {
      arg: {
        value: [
          {
            field1: 1,
            field2: 2,
            field3: "test1",
            field4: "E1",
          },
          {
            field1: 3,
            field2: 4,
            field3: "test2",
            field4: "E2",
          },
        ],
      },
    },
    field1: true,
  },
});

const testResultType: Assert<
  ResultOf<typeof mutation>,
  {
    mutationWithNullableInputObjectNonNullArrayArg: {
      __typename: "ObjectB";
      field1: string | null;
    };
  }
> = true;

export const expectedQuery = `\
mutation TestMutation {
  mutationWithNullableInputObjectNonNullArrayArg(
    arg: [{field1: 1, field2: 2, field3: "test1", field4: E1}, {field1: 3, field2: 4, field3: "test2", field4: E2}]
  ) {
    __typename
    field1
  }
}`;
