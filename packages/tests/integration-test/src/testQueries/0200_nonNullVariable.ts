/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type ResultOf,
  type VariablesOf,
} from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $q } from "../graqq.gen";

export const query = $q("TestQuery", {
  arg1: "String!",
})({
  queryWithNonNullStringArg: {
    $args: { arg: "arg1" },
    field1: true,
  },
});

const testResultType: Assert<
  ResultOf<typeof query>,
  {
    queryWithNonNullStringArg: {
      field1: string | null;
    };
  }
> = true;
const testVariablesType: Assert<
  VariablesOf<typeof query>,
  {
    arg1: string;
  }
> = true;

export const expectedQuery = `\
query TestQuery($arg1: String!) {
  queryWithNonNullStringArg(arg: $arg1) {
    field1
  }
}`;
