import {
  NodeFlags,
  SyntaxKind,
  factory,
  type Node,
  type TypeAliasDeclaration,
  type TypeElement,
  type TypeNode,
  type TypeReferenceNode,
  type VariableStatement,
} from "typescript";

import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLUnionType,
  type GraphQLField,
  type GraphQLFieldMap,
  type GraphQLInputField,
  type GraphQLInputType,
  type GraphQLNamedType,
  type GraphQLOutputType,
} from "graphql";

import { type ScalarsConfig } from "./config";
import { unwrapType } from "./gqlUtils";
import { logger } from "./logger";
import { wrapType } from "./tsUtils";

const LOG_LABEL = "OBJECT_TYPES_RESOLVER";

type Context = {
  scalars: ScalarsConfig;
};

/**
 * Constructs Object types from GraphQL types.
 *
 * @param gqlObjectTypes
 * @param context
 * @returns list of Object type nodes
 */
export const resolveObjectTypes = (
  gqlObjectTypes: GraphQLNamedType[],
  context?: Context,
): Node[] => {
  logger.debug(`${LOG_LABEL}: start resolving object types`);

  const enumConstDeclarations = gqlObjectTypes
    .map((t) => resolveEnumConst(t, context))
    .filter((r): r is VariableStatement => !(r == null));

  const objectTypes = gqlObjectTypes
    .map((t) => resolveObjectType(t, context))
    .filter((r): r is TypeAliasDeclaration => !(r == null));

  const aggregatedType = factory.createTypeAliasDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier(`GraphQLObjectTypes`),
    undefined,
    factory.createTypeLiteralNode(
      objectTypes.map((o) =>
        factory.createPropertySignature(
          undefined,
          o.name,
          undefined,
          factory.createTypeReferenceNode(o.name),
        ),
      ),
    ),
  );

  return [...enumConstDeclarations, ...objectTypes, aggregatedType];
};

/**
 * Constructs InputObject types from GraphQL types.
 *
 * @param gqlObjectTypes
 * @param context
 * @returns list of InputObject type nodes
 */
export const resolveInputObjectTypes = (
  gqlObjectTypes: GraphQLNamedType[],
  context?: Context,
): Node[] => {
  logger.debug(`${LOG_LABEL}: start resolving input object types`);

  const objectTypes = gqlObjectTypes
    .map((o) => resolveInputObjectType(o, context))
    .filter((r): r is TypeAliasDeclaration => !(r == null));

  const aggregatedType = factory.createTypeAliasDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier(`GraphQLInputObjectTypes`),
    undefined,
    factory.createTypeLiteralNode(
      objectTypes.map((o) =>
        factory.createPropertySignature(
          undefined,
          o.name,
          undefined,
          factory.createTypeReferenceNode(o.name),
        ),
      ),
    ),
  );

  return [...objectTypes, aggregatedType];
};

const resolveObjectType = (
  gqlObjectType: GraphQLNamedType,
  context?: Context,
): TypeAliasDeclaration | null => {
  if (gqlObjectType instanceof GraphQLObjectType) {
    logger.debug(`${LOG_LABEL}: \tObjectType: ${gqlObjectType.name}`);

    const fields: GraphQLFieldMap<
      string,
      GraphQLField<any, any>
    > = gqlObjectType.getFields();

    const fieldDeclarations = Object.values(fields)
      .map((f) => resolveFieldType(f, context))
      .filter((r): r is TypeElement => !(r == null));

    return factory.createTypeAliasDeclaration(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createIdentifier(gqlObjectType.name),
      undefined,
      factory.createTypeLiteralNode([
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier("__typename"),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createLiteralTypeNode(
            factory.createStringLiteral(gqlObjectType.name),
          ),
        ),
        ...fieldDeclarations,
      ]),
    );
  }

  if (gqlObjectType instanceof GraphQLEnumType) {
    logger.debug(`${LOG_LABEL}: \tObjectType(Enum): ${gqlObjectType.name}`);

    return factory.createTypeAliasDeclaration(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createIdentifier(gqlObjectType.name),
      undefined,
      factory.createTypeReferenceNode(
        `typeof ${gqlObjectType.name}[keyof typeof ${gqlObjectType.name}]`,
      ),
    );
  }

  if (gqlObjectType instanceof GraphQLUnionType) {
    logger.debug(`${LOG_LABEL}: \tObjectType(Union): ${gqlObjectType.name}`);

    return factory.createTypeAliasDeclaration(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createIdentifier(gqlObjectType.name),
      undefined,
      factory.createUnionTypeNode(
        gqlObjectType
          .getTypes()
          .map((t) => factory.createTypeReferenceNode(t.name)),
      ),
    );
  }

  return null;
};

const resolveEnumConst = (
  gqlObjectType: GraphQLNamedType,
  context?: Context,
): VariableStatement | null => {
  if (gqlObjectType instanceof GraphQLEnumType) {
    logger.debug(`${LOG_LABEL}: \tEnumConst: ${gqlObjectType.name}`);

    const variableStatement = factory.createVariableStatement(
      [],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            gqlObjectType.name,
            undefined,
            undefined,
            factory.createAsExpression(
              factory.createObjectLiteralExpression(
                gqlObjectType.getValues().map((v) => {
                  const objectProperty = factory.createPropertyAssignment(
                    factory.createIdentifier(v.name),
                    factory.createStringLiteral(v.name),
                  );

                  return objectProperty;
                }),
                true,
              ),
              factory.createTypeReferenceNode("const"),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    );

    return variableStatement;
  }
  return null;
};

const resolveInputObjectType = (
  gqlObjectType: GraphQLNamedType,
  context?: Context,
): TypeAliasDeclaration | null => {
  if (gqlObjectType instanceof GraphQLInputObjectType) {
    logger.debug(`${LOG_LABEL}: \tInputObjectType: ${gqlObjectType.name}`);

    const fields = gqlObjectType.getFields();

    const fieldDeclarations = Object.values(fields)
      .map((f) => resolveFieldType(f, context, { nullableAsOptional: true }))
      .filter((r): r is TypeElement => !(r == null));

    return factory.createTypeAliasDeclaration(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createIdentifier(gqlObjectType.name),
      undefined,
      factory.createTypeLiteralNode(fieldDeclarations),
    );
  }

  return null;
};

const resolveFieldType = (
  gqlField: GraphQLField<any, any> | GraphQLInputField,
  context?: Context,
  options?: { nullableAsOptional?: boolean },
): TypeElement | null => {
  logger.debug(`${LOG_LABEL}: \t\tFieldType: ${gqlField.name}`);

  const {
    type: gqlFieldValueType,
    nullable,
    list,
    listItemNullable,
  } = unwrapType(gqlField.type);

  const fieldValueType = resolveValueType(gqlFieldValueType, context);
  if (fieldValueType != null) {
    return factory.createPropertySignature(
      undefined,
      factory.createIdentifier(gqlField.name),
      nullable && options?.nullableAsOptional === true
        ? factory.createToken(SyntaxKind.QuestionToken)
        : undefined,
      wrapType(fieldValueType, { nullable, list, listItemNullable }),
    );
  }

  return null;
};

export const resolveValueType = (
  gqlFieldValueType: GraphQLOutputType | GraphQLInputType,
  context?: Context,
): TypeNode | null => {
  if (gqlFieldValueType instanceof GraphQLList) {
    const elementType = resolveValueType(gqlFieldValueType.ofType, context);
    if (elementType != null) {
      return factory.createArrayTypeNode(elementType);
    }
  }

  if (gqlFieldValueType instanceof GraphQLScalarType) {
    return resolveScalarType(gqlFieldValueType, context);
  }

  if (gqlFieldValueType instanceof GraphQLObjectType) {
    return factory.createTypeReferenceNode(gqlFieldValueType.name);
  }

  if (gqlFieldValueType instanceof GraphQLInputObjectType) {
    return factory.createTypeReferenceNode(gqlFieldValueType.name);
  }

  if (gqlFieldValueType instanceof GraphQLEnumType) {
    return factory.createTypeReferenceNode(gqlFieldValueType.name);
  }

  if (gqlFieldValueType instanceof GraphQLUnionType) {
    return factory.createTypeReferenceNode(gqlFieldValueType.name);
  }

  return null;
};

const resolveScalarType = (
  gqlScalarType: GraphQLScalarType,
  context?: Context,
): TypeReferenceNode | null => {
  if (gqlScalarType.name === "ID") {
    return factory.createTypeReferenceNode("string");
  }
  if (gqlScalarType.name === "String") {
    return factory.createTypeReferenceNode("string");
  }
  if (gqlScalarType.name === "Int") {
    return factory.createTypeReferenceNode("number");
  }
  if (gqlScalarType.name === "Float") {
    return factory.createTypeReferenceNode("number");
  }
  if (gqlScalarType.name === "Boolean") {
    return factory.createTypeReferenceNode("boolean");
  }
  if (context?.scalars[gqlScalarType.name] != null) {
    return factory.createTypeReferenceNode(context.scalars[gqlScalarType.name]);
  }

  return null;
};
