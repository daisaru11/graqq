import {
  type AddTypenameRecursive,
  type ApplyAddTypenameRecursiveToFields,
} from "./types";

export const addTypenameRecursive = <QUERY_OBJECT>(
  queryObject: QUERY_OBJECT,
): AddTypenameRecursive<QUERY_OBJECT> => {
  return {
    __typename: true,
    ...(applyAddTypenameRecursiveToFields(queryObject) as any),
  };
};

export const applyAddTypenameRecursiveToFields = <QUERY_OBJECT>(
  queryObject: QUERY_OBJECT,
): ApplyAddTypenameRecursiveToFields<QUERY_OBJECT> => {
  const result: any = {};
  for (const k in queryObject) {
    if (k === "$args" || k === "$type") {
      result[k] = queryObject[k];
      continue;
    }
    if (k === "$on") {
      result[k] = {};
      for (const typeName in queryObject[k]) {
        result[k][typeName] = applyAddTypenameRecursiveToFields(
          queryObject[k][typeName],
        );
      }
      continue;
    }
    if (typeof queryObject[k] === "boolean") {
      result[k] = queryObject[k];
      continue;
    }

    if (typeof queryObject[k] === "object") {
      result[k] = addTypenameRecursive(queryObject[k]);
      continue;
    }
  }

  return result;
};
