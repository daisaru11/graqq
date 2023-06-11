/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type ResultOf,
  type VariablesOf,
} from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $m, type InputObjectC } from "../graqq.gen";

export const mutation = $m("TestMutation", {
  testArg1: "String!",
  testArg2: "String",
  testArg3: "InputObjectC!",
  testArg4: "InputObjectC",
  testArg5: "[String]",
  testArg6: "[String]!",
  testArg7: "[String!]",
  testArg8: "[String!]!",
  testArg9: "[InputObjectC]",
  testArg10: "[InputObjectC]!",
  testArg11: "[InputObjectC!]",
  testArg12: "[InputObjectC!]!",
})({
  mutationWithMultipleArgs: {
    $args: {
      arg1: "testArg1",
      arg2: "testArg2",
      arg3: "testArg3",
      arg4: "testArg4",
      arg5: "testArg5",
      arg6: "testArg6",
      arg7: "testArg7",
      arg8: "testArg8",
      arg9: "testArg9",
      arg10: "testArg10",
      arg11: "testArg11",
      arg12: "testArg12",
    },
    nullableString: true,
  },
});

const testResultType: Assert<
  ResultOf<typeof mutation>,
  {
    mutationWithMultipleArgs: {
      nullableString: string | null;
    };
  }
> = true;

type A = VariablesOf<typeof mutation>;
const testVariablesType: Assert<
  VariablesOf<typeof mutation>,
  {
    testArg1: string;
    testArg2: string | null;
    testArg3: InputObjectC;
    testArg4: InputObjectC | null;
    testArg5: Array<string | null> | null;
    testArg6: Array<string | null>;
    testArg7: string[] | null;
    testArg8: string[];
    testArg9: Array<InputObjectC | null> | null;
    testArg10: Array<InputObjectC | null>;
    testArg11: InputObjectC[] | null;
    testArg12: InputObjectC[];
  }
> = true;

export const expectedQuery = `\
mutation TestMutation($testArg1: String!, $testArg2: String, $testArg3: InputObjectC!, $testArg4: InputObjectC, $testArg5: [String], $testArg6: [String]!, $testArg7: [String!], $testArg8: [String!]!, $testArg9: [InputObjectC], $testArg10: [InputObjectC]!, $testArg11: [InputObjectC!], $testArg12: [InputObjectC!]!) {
  mutationWithMultipleArgs(
    arg1: $testArg1
    arg2: $testArg2
    arg3: $testArg3
    arg4: $testArg4
    arg5: $testArg5
    arg6: $testArg6
    arg7: $testArg7
    arg8: $testArg8
    arg9: $testArg9
    arg10: $testArg10
    arg11: $testArg11
    arg12: $testArg12
  ) {
    nullableString
  }
}`;
