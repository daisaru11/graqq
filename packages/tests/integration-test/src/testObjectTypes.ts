/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Assert } from "@graqq/testutil";

import {
  type InterfaceD,
  type EnumA,
  type InputObjectC,
  type ObjectA,
  type ObjectB,
  type UnionBC,
} from "./graqq.gen";

const testObjectType: Assert<
  ObjectA,
  {
    __typename?: "ObjectA";
    nullableString: string | null;
    nonNullString: string;
    nullableInt: number | null;
    nonNullInt: number;
    nullableFloat: number | null;
    nonNullFloat: number;
    nullableBoolean: boolean | null;
    nonNullBoolean: boolean;
    nullableEnum: EnumA | null;
    nonNullEnum: EnumA;
    nullableObject: ObjectB | null;
    nonNullObject: ObjectB;
    nullableStringNullableArray: Array<string | null> | null;
    nullableStringNonNullArray: Array<string | null>;
    nonNullStringNullableArray: string[] | null;
    nonNullStringNonNullArray: string[];
    nullableEnumNullableArray: Array<EnumA | null> | null;
    nullableEnumNonNullArray: Array<EnumA | null>;
    nonNullEnumNullableArray: EnumA[] | null;
    nonNullEnumNonNullArray: EnumA[];
    nullableObjectNullableArray: Array<ObjectB | null> | null;
    nullableObjectNonNullArray: Array<ObjectB | null>;
    nonNullObjectNullableArray: ObjectB[] | null;
    nonNullObjectNonNullArray: ObjectB[];
    nullableUnion: UnionBC | null;
    nonNullUnion: UnionBC;
    nullableInterface: InterfaceD | null;
    nonNullInterface: InterfaceD;
  }
> = true;

const testEnumType: Assert<EnumA, "E1" | "E2" | "E3"> = true;

const testInputObjectType: Assert<
  InputObjectC,
  {
    field1: number;
    field2?: number | null | undefined;
    field3: string;
    field4: EnumA;
  }
> = true;
