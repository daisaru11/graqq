import {
  NodeFlags,
  factory,
  type Node,
  type PropertyAssignment,
} from "typescript";

import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLUnionType,
  type GraphQLArgument,
  type GraphQLField,
  type GraphQLFieldMap,
  type GraphQLInputField,
  type GraphQLInputFieldMap,
  type GraphQLNamedType,
} from "graphql";

import { unwrapType } from "./gqlUtils";
import { logger } from "./logger";

const LOG_LABEL = "TYPE_MAP_RESOLVER";

/**
 * Generate type information referred at runtime.
 *
 * @param gqlObjectTypes
 * @returns variable declarations that include type information
 */
export const resolveTypeMap = (gqlObjectTypes: GraphQLNamedType[]): Node[] => {
  logger.debug(`${LOG_LABEL}: start resolving typeMap`);

  const objectProperties = gqlObjectTypes
    .map(resolveObjectTypeMap)
    .filter((r): r is PropertyAssignment => !(r == null));

  const variableStatement = factory.createVariableStatement(
    [],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          "TypeMap",
          undefined,
          undefined,
          factory.createObjectLiteralExpression(objectProperties, true),
        ),
      ],
      NodeFlags.Const,
    ),
  );

  return [variableStatement];
};

const resolveObjectTypeMap = (
  gqlObjectType: GraphQLNamedType,
): PropertyAssignment | null => {
  if (gqlObjectType instanceof GraphQLObjectType) {
    logger.debug(`${LOG_LABEL}: \tObjectType: ${gqlObjectType.name}`);

    const fields: GraphQLFieldMap<
      string,
      GraphQLField<any, any>
    > = gqlObjectType.getFields();

    const fieldDeclarations = Object.values(fields)
      .map(resolveObjectFieldTypeMap)
      .filter((r): r is PropertyAssignment => !(r == null));

    const objectProperty = factory.createPropertyAssignment(
      factory.createIdentifier(gqlObjectType.name),
      factory.createObjectLiteralExpression(fieldDeclarations, true),
    );

    return objectProperty;
  }
  if (gqlObjectType instanceof GraphQLInputObjectType) {
    logger.debug(`${LOG_LABEL}: \tInputObjectType: ${gqlObjectType.name}`);

    const fields: GraphQLInputFieldMap = gqlObjectType.getFields();

    const fieldDeclarations = Object.values(fields)
      .map(resolveInputObjectFieldTypeMap)
      .filter((r): r is PropertyAssignment => !(r == null));

    const objectProperty = factory.createPropertyAssignment(
      factory.createIdentifier(gqlObjectType.name),
      factory.createObjectLiteralExpression(fieldDeclarations, true),
    );

    return objectProperty;
  }
  if (gqlObjectType instanceof GraphQLUnionType) {
    const objectProperty = factory.createPropertyAssignment(
      factory.createIdentifier(gqlObjectType.name),
      factory.createObjectLiteralExpression([], true),
    );

    return objectProperty;
  }

  return null;
};

const resolveObjectFieldTypeMap = (
  gqlField: GraphQLField<any, any>,
): PropertyAssignment | null => {
  logger.debug(`${LOG_LABEL}: \t\tFieldType: ${gqlField.name}`);

  const type = resolveType(gqlField);
  if (type == null) {
    return null;
  }

  const argTypeProps = gqlField.args
    .map(resolveArgumentTypeMap)
    .filter((r): r is PropertyAssignment => !(r == null));

  return factory.createPropertyAssignment(
    factory.createIdentifier(gqlField.name),
    factory.createObjectLiteralExpression(
      [
        ...type.properties,
        factory.createPropertyAssignment(
          factory.createIdentifier("$args"),
          factory.createObjectLiteralExpression(argTypeProps, true),
        ),
      ],
      true,
    ),
  );
};

const resolveInputObjectFieldTypeMap = (
  gqlField: GraphQLInputField,
): PropertyAssignment | null => {
  logger.debug(`${LOG_LABEL}: \t\tFieldType: ${gqlField.name}`);

  const type = resolveType(gqlField);
  if (type == null) {
    return null;
  }

  return factory.createPropertyAssignment(
    factory.createIdentifier(gqlField.name),
    factory.createObjectLiteralExpression([...type.properties], true),
  );
};

const resolveArgumentTypeMap = (gqlArg: GraphQLArgument) => {
  const type = resolveType(gqlArg);

  if (type != null) {
    return factory.createPropertyAssignment(
      factory.createIdentifier(gqlArg.name),
      type,
    );
  }

  return null;
};

const resolveType = (
  gqlArgOrField: GraphQLArgument | GraphQLField<any, any>,
) => {
  const {
    type: gqlType,
    nullable,
    list,
    listItemNullable,
  } = unwrapType(gqlArgOrField.type);

  if (gqlType instanceof GraphQLScalarType) {
    return factory.createObjectLiteralExpression(
      [
        factory.createPropertyAssignment(
          factory.createIdentifier("type"),
          factory.createStringLiteral("Scalar"),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("typeName"),
          factory.createStringLiteral(gqlType.name),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("nullable"),
          nullable ? factory.createTrue() : factory.createFalse(),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("list"),
          list ? factory.createTrue() : factory.createFalse(),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("listItemNullable"),
          listItemNullable ? factory.createTrue() : factory.createFalse(),
        ),
      ],
      true,
    );
  }

  if (gqlType instanceof GraphQLObjectType) {
    return factory.createObjectLiteralExpression(
      [
        factory.createPropertyAssignment(
          factory.createIdentifier("type"),
          factory.createStringLiteral("Object"),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("typeName"),
          factory.createStringLiteral(gqlType.name),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("nullable"),
          nullable ? factory.createTrue() : factory.createFalse(),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("list"),
          list ? factory.createTrue() : factory.createFalse(),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("listItemNullable"),
          listItemNullable ? factory.createTrue() : factory.createFalse(),
        ),
      ],
      true,
    );
  }

  if (gqlType instanceof GraphQLInputObjectType) {
    return factory.createObjectLiteralExpression(
      [
        factory.createPropertyAssignment(
          factory.createIdentifier("type"),
          factory.createStringLiteral("InputObject"),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("typeName"),
          factory.createStringLiteral(gqlType.name),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("nullable"),
          nullable ? factory.createTrue() : factory.createFalse(),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("list"),
          list ? factory.createTrue() : factory.createFalse(),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("listItemNullable"),
          listItemNullable ? factory.createTrue() : factory.createFalse(),
        ),
      ],
      true,
    );
  }

  if (gqlType instanceof GraphQLEnumType) {
    return factory.createObjectLiteralExpression(
      [
        factory.createPropertyAssignment(
          factory.createIdentifier("type"),
          factory.createStringLiteral("Enum"),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("typeName"),
          factory.createStringLiteral(gqlType.name),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("nullable"),
          nullable ? factory.createTrue() : factory.createFalse(),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("list"),
          list ? factory.createTrue() : factory.createFalse(),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("listItemNullable"),
          listItemNullable ? factory.createTrue() : factory.createFalse(),
        ),
      ],
      true,
    );
  }

  if (gqlType instanceof GraphQLUnionType) {
    return factory.createObjectLiteralExpression(
      [
        factory.createPropertyAssignment(
          factory.createIdentifier("type"),
          factory.createStringLiteral("Union"),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("typeName"),
          factory.createStringLiteral(gqlType.name),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("nullable"),
          nullable ? factory.createTrue() : factory.createFalse(),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("list"),
          list ? factory.createTrue() : factory.createFalse(),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("listItemNullable"),
          listItemNullable ? factory.createTrue() : factory.createFalse(),
        ),
      ],
      true,
    );
  }

  return null;
};
