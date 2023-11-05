import { GraphQLObjectType, type GraphQLNamedType } from "graphql";

export type InterfaceImplementsMap = Record<string, GraphQLObjectType[]>;

export const resolveInterfaceImplementsMap = (
  gqlObjectTypes: GraphQLNamedType[],
): InterfaceImplementsMap => {
  const map: InterfaceImplementsMap = {};

  for (const gqlObjectType of gqlObjectTypes) {
    if (gqlObjectType instanceof GraphQLObjectType) {
      gqlObjectType.getInterfaces().forEach((i) => {
        if (map[i.name] == null) {
          map[i.name] = [];
        }
        map[i.name].push(gqlObjectType);
      });
    }
  }

  return map;
};
