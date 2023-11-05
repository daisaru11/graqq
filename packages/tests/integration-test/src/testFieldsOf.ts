/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Assert } from "@graqq/testutil";

import { $fieldsOf, type InferFields } from "./graqq.gen";

const fields = $fieldsOf("ObjectA")({
  nullableString: true,
  nonNullString: true,
  nullableInt: true,
  nonNullInt: true,
  nullableFloat: true,
  nonNullFloat: true,
  nullableBoolean: true,
  nonNullBoolean: true,
});

type ObjectAFields = InferFields<typeof fields>;

const testObjectType: Assert<
  ObjectAFields,
  {
    __typename: "ObjectA";
    nullableString: string | null;
    nonNullString: string;
    nullableInt: number | null;
    nonNullInt: number;
    nullableFloat: number | null;
    nonNullFloat: number;
    nullableBoolean: boolean | null;
    nonNullBoolean: boolean;
  }
> = true;
