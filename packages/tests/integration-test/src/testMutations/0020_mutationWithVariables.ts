/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type ResultOf,
  type VariablesOf,
} from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $m, type InputObjectC } from "../graqq.gen";

export const mutation = $m("TestMutation", {
  arg1: "InputObjectC!",
})({
  mutationWithNonNullInputObjectArg: {
    $args: {
      arg: "arg1",
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

const testVariablesType: Assert<
  VariablesOf<typeof mutation>,
  {
    arg1: InputObjectC;
  }
> = true;

export const expectedQuery = `\
mutation TestMutation($arg1: InputObjectC!) {
  mutationWithNonNullInputObjectArg(arg: $arg1) {
    __typename
    field1
  }
}`;
