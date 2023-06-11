import { type TypeNode, factory } from "typescript";

export const wrapListType = (type: TypeNode, list: boolean) => {
  return list ? factory.createArrayTypeNode(type) : type;
};

export const wrapNullableType = (type: TypeNode, nullable: boolean) => {
  return nullable
    ? factory.createUnionTypeNode([
        type,
        factory.createTypeReferenceNode("null"),
      ])
    : type;
};

export const wrapType = (
  type: TypeNode,
  {
    nullable,
    list,
    listItemNullable,
  }: { nullable: boolean; list: boolean; listItemNullable: boolean },
) => {
  return wrapNullableType(
    wrapListType(wrapNullableType(type, listItemNullable), list),
    nullable,
  );
};
