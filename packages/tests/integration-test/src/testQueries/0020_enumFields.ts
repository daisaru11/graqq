/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ResultOf } from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $q, type EnumA } from "../graqq.gen";

export const query = $q("TestQuery")({
  query: {
    nullableEnum: true,
    nonNullEnum: true,
  },
});

const testResultType: Assert<
  ResultOf<typeof query>,
  {
    query: {
      nullableEnum: EnumA | null;
      nonNullEnum: EnumA;
    };
  }
> = true;

export const expectedQuery = `\
query TestQuery {
  query {
    nullableEnum
    nonNullEnum
  }
}`;
