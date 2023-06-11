import {
  type GraphQLInputType,
  GraphQLList,
  GraphQLNonNull,
  type GraphQLOutputType,
} from "graphql";

export const unwrapType = (gqlType: GraphQLOutputType | GraphQLInputType) => {
  let nullable = true;
  let list = false;
  let listItemNullable = false;

  if (gqlType instanceof GraphQLNonNull) {
    nullable = false;
    gqlType = gqlType.ofType;
  }
  if (gqlType instanceof GraphQLList) {
    list = true;
    listItemNullable = true;
    gqlType = gqlType.ofType;
    if (gqlType instanceof GraphQLNonNull) {
      listItemNullable = false;
      gqlType = gqlType.ofType;
    }
  }

  return {
    type: gqlType,
    nullable,
    list,
    listItemNullable,
  };
};
