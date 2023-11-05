/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ResultOf } from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $q, type EnumA } from "../graqq.gen";

export const query = $q("TestQuery")({
  query: {
    nullableStringNullableArray: true,
    nullableStringNonNullArray: true,
    nonNullStringNullableArray: true,
    nonNullStringNonNullArray: true,
    nullableEnumNullableArray: true,
    nullableEnumNonNullArray: true,
    nonNullEnumNullableArray: true,
    nonNullEnumNonNullArray: true,
    nullableObjectNullableArray: { field1: true, field2: true },
    nullableObjectNonNullArray: { field1: true, field2: true },
    nonNullObjectNullableArray: { field1: true, field2: true },
    nonNullObjectNonNullArray: { field1: true, field2: true },
  },
});

const testResultType: Assert<
  ResultOf<typeof query>,
  {
    query: {
      __typename: "ObjectA";
      nullableStringNullableArray: Array<string | null> | null;
      nullableStringNonNullArray: Array<string | null>;
      nonNullStringNullableArray: string[] | null;
      nonNullStringNonNullArray: string[];
      nullableEnumNullableArray: Array<EnumA | null> | null;
      nullableEnumNonNullArray: Array<EnumA | null>;
      nonNullEnumNullableArray: EnumA[] | null;
      nonNullEnumNonNullArray: EnumA[];
      nullableObjectNullableArray: Array<{
        __typename: "ObjectB";
        field1: string | null;
        field2: number;
      } | null> | null;
      nullableObjectNonNullArray: Array<{
        __typename: "ObjectB";
        field1: string | null;
        field2: number;
      } | null>;
      nonNullObjectNullableArray: Array<{
        __typename: "ObjectB";
        field1: string | null;
        field2: number;
      }> | null;
      nonNullObjectNonNullArray: Array<{
        __typename: "ObjectB";
        field1: string | null;
        field2: number;
      }>;
    };
  }
> = true;

export const expectedQuery = `\
query TestQuery {
  query {
    __typename
    nullableStringNullableArray
    nullableStringNonNullArray
    nonNullStringNullableArray
    nonNullStringNonNullArray
    nullableEnumNullableArray
    nullableEnumNonNullArray
    nonNullEnumNullableArray
    nonNullEnumNonNullArray
    nullableObjectNullableArray {
      __typename
      field1
      field2
    }
    nullableObjectNonNullArray {
      __typename
      field1
      field2
    }
    nonNullObjectNullableArray {
      __typename
      field1
      field2
    }
    nonNullObjectNonNullArray {
      __typename
      field1
      field2
    }
  }
}`;
