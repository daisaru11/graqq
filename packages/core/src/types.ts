type NonNull<T> = T extends null ? never : T;

type SameKeysOf<T> = {
  [P in keyof T]?: any;
};

type RequiredProps<T> = Omit<
  T,
  {
    [P in keyof T]-?: undefined extends T[P] ? P : never;
  }[keyof T]
>;

type OptionalProps<T> = Pick<
  T,
  {
    [P in keyof T]-?: undefined extends T[P] ? P : never;
  }[keyof T]
>;

type Merge<T, U> = Simplify<T & U>;

type UndefinedToOptional<T> = Merge<
  RequiredProps<T>,
  Partial<OptionalProps<T>>
>;

type PickDefined<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends never ? never : K }[keyof T]
>;

type Simplify<T> = T extends unknown ? { [K in keyof T]: T[K] } : T;

type Values<T> = T[keyof T];

type ObjectTypeName<T> = T extends { __typename?: infer U } ? U : never;

export type MapGraphQLType<
  OBJECT_TYPES,
  OBJECT_TYPE extends SameKeysOf<QUERY_OBJECT>,
  QUERY_OBJECT,
> = Simplify<
  MapGraphQLFieldsType<OBJECT_TYPES, OBJECT_TYPE, QUERY_OBJECT> &
    ("$on" extends keyof QUERY_OBJECT
      ? MapGraphQLUnionFieldsType<
          OBJECT_TYPES,
          OBJECT_TYPE,
          QUERY_OBJECT["$on"]
        >
      : {})
>;

type MapGraphQLFieldsType<
  OBJECT_TYPES,
  OBJECT_TYPE extends SameKeysOf<QUERY_OBJECT>,
  QUERY_OBJECT,
> = PickDefined<
  UndefinedToOptional<{
    [P in Exclude<
      keyof QUERY_OBJECT,
      "$args" | "$type" | "$on"
    >]: P extends keyof OBJECT_TYPE
      ? QUERY_OBJECT[P] extends true
        ? OBJECT_TYPE[P]
        : QUERY_OBJECT[P] extends false
        ? never
        : QUERY_OBJECT[P] extends boolean
        ? OBJECT_TYPE[P] | undefined
        : UnwrapAndMapGraphQLType<OBJECT_TYPES, OBJECT_TYPE[P], QUERY_OBJECT[P]>
      : never;
  }>
>;

type MapGraphQLUnionFieldsType<OBJECT_TYPES, OBJECT_TYPE, UNION_QUERY_OBJECT> =
  Values<
    PickDefined<{
      [P in keyof UNION_QUERY_OBJECT]: P extends ObjectTypeName<OBJECT_TYPE>
        ? MapGraphQLType<OBJECT_TYPES, OBJECT_TYPE, UNION_QUERY_OBJECT[P]>
        : never;
    }>
  >;

type UnwrapAndMapGraphQLType<OBJECT_TYPES, OBJECT_TYPE, QUERY_OBJECT> =
  OBJECT_TYPE extends Array<NonNull<infer E>>
    ? Array<MapGraphQLType<OBJECT_TYPES, E, QUERY_OBJECT>>
    : OBJECT_TYPE extends Array<infer E | null>
    ? Array<MapGraphQLType<OBJECT_TYPES, E, QUERY_OBJECT> | null>
    : OBJECT_TYPE extends NonNull<infer E>
    ? MapGraphQLType<OBJECT_TYPES, E, QUERY_OBJECT>
    : OBJECT_TYPE extends null
    ? null
    : MapGraphQLType<OBJECT_TYPES, OBJECT_TYPE, QUERY_OBJECT>;

type ScalarTypes = "String" | "Int" | "Float" | "ID" | "Boolean";
type VariableTypes<INPUT_OBJECT_TYPES> =
  | ScalarTypes
  | Extract<keyof INPUT_OBJECT_TYPES, string>;

type _VariableExpressions<T extends string> =
  | `${T}!`
  | T
  | `[${T}]`
  | `[${T}]!`
  | `[${T}!]`
  | `[${T}!]!`;

type VariableExpressions<INPUT_OBJECT_TYPES> = _VariableExpressions<
  VariableTypes<INPUT_OBJECT_TYPES>
>;

export type MapVariablesType<
  INPUT_OBJECT_TYPES,
  T extends Record<string, VariableExpressions<INPUT_OBJECT_TYPES>>,
> = {
  [K in keyof T]: MapVariableStringTypeToType<INPUT_OBJECT_TYPES, T[K]>;
};

type MapVariableStringTypeToType<
  INPUT_OBJECT_TYPES,
  VAR_EXP extends string,
> = VAR_EXP extends `[${infer T}!]!`
  ? Array<MapInputTypeStringToType<INPUT_OBJECT_TYPES, T>>
  : VAR_EXP extends `[${infer T}!]`
  ? Array<MapInputTypeStringToType<INPUT_OBJECT_TYPES, T>> | null
  : VAR_EXP extends `[${infer T}]!`
  ? Array<MapInputTypeStringToType<INPUT_OBJECT_TYPES, T> | null>
  : VAR_EXP extends `[${infer T}]`
  ? Array<MapInputTypeStringToType<INPUT_OBJECT_TYPES, T> | null> | null
  : VAR_EXP extends `${infer T}!`
  ? MapInputTypeStringToType<INPUT_OBJECT_TYPES, T>
  : MapInputTypeStringToType<INPUT_OBJECT_TYPES, VAR_EXP> | null;

type MapInputTypeStringToType<
  INPUT_OBJECT_TYPE,
  VAR_TYPE_NAME extends string,
> = VAR_TYPE_NAME extends keyof INPUT_OBJECT_TYPE
  ? INPUT_OBJECT_TYPE[VAR_TYPE_NAME]
  : MapScalarStringToType<VAR_TYPE_NAME>;

type MapScalarStringToType<S extends string> = S extends "String"
  ? string
  : S extends "Int"
  ? number
  : S extends "Float"
  ? number
  : S extends "ID"
  ? unknown
  : S extends "Boolean"
  ? boolean
  : never;

export type Variables<G> = Record<string, VariableExpressions<G>>;

export type AddTypenameRecursive<T> = Simplify<
  ApplyAddTypenameRecursiveToFields<T> & { __typename: true }
>;

export type ApplyAddTypenameRecursiveToFields<T> = {
  [K in keyof T]: T[K] extends boolean
    ? T[K]
    : K extends "$args" | "$type"
    ? T[K]
    : K extends "$on"
    ? Simplify<ApplyTypenameRecursiveToUnionTypes<T[K]>>
    : Simplify<AddTypenameRecursive<T[K]>>;
};

type ApplyTypenameRecursiveToUnionTypes<UNION_TYPES> = {
  [TYPE_NAME in keyof UNION_TYPES]: Simplify<
    ApplyAddTypenameRecursiveToFields<UNION_TYPES[TYPE_NAME]>
  >;
};
