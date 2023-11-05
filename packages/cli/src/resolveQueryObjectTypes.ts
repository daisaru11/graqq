import {
  SyntaxKind,
  factory,
  type Node,
  type PropertySignature,
  type TypeElement,
  type TypeNode,
} from "typescript";

import {
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLUnionType,
  type GraphQLArgument,
  type GraphQLField,
  type GraphQLFieldMap,
  type GraphQLNamedType,
} from "graphql";

import { unwrapType } from "./gqlUtils";
import { logger } from "./logger";
import {
  resolveInterfaceImplementsMap,
  type InterfaceImplementsMap,
} from "./resolveInterfaceImplementsMap";
import { resolveValueType } from "./resolveObjectTypes";
import { wrapType } from "./tsUtils";

const LOG_LABEL = "QUERY_OBJECT_TYPES_RESOLVER";

/**
 * Construct type declarations for QueryObject types.
 *
 * @param gqlObjectTypes
 * @returns list of QueryObject type declarations
 */
export const resolveQueryObjectTypes = (
  gqlObjectTypes: GraphQLNamedType[],
): Node[] => {
  logger.debug(`${LOG_LABEL}: start resolving queryObject types`);

  const interfaceImplementsMap = resolveInterfaceImplementsMap(gqlObjectTypes);
  const queryObjectTypes = gqlObjectTypes
    .map((o) => resolveQueryObjectType(o, interfaceImplementsMap))
    .filter((r): r is TypeElement => !(r == null));

  const aggregatedType = factory.createTypeAliasDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier(`QueryObjectTypes`),
    [
      factory.createTypeParameterDeclaration(
        undefined,
        "V",
        factory.createTypeReferenceNode("string"),
        factory.createTypeReferenceNode("never"),
      ),
    ],
    factory.createTypeLiteralNode(queryObjectTypes),
  );

  return [aggregatedType];
};

export const resolveQueryObjectType = (
  gqlObjectType: GraphQLNamedType,
  interfaceImplementsMap: InterfaceImplementsMap,
): TypeElement | null => {
  if (gqlObjectType instanceof GraphQLObjectType) {
    logger.debug(`${LOG_LABEL}: \tObjectType: ${gqlObjectType.name}`);

    const fields: GraphQLFieldMap<
      string,
      GraphQLField<any, any>
    > = gqlObjectType.getFields();

    const fieldDeclarations = Object.values(fields)
      .map(resolveQueryFieldType)
      .filter((r): r is TypeElement => !(r == null));

    const queryObjectType = factory.createPropertySignature(
      undefined,
      factory.createIdentifier(gqlObjectType.name),
      undefined,
      factory.createTypeLiteralNode([
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier("$type"),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createLiteralTypeNode(
            factory.createStringLiteral(gqlObjectType.name),
          ),
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier("__typename"),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeReferenceNode("boolean"),
        ),
        ...fieldDeclarations,
      ]),
    );

    return queryObjectType;
  }

  if (gqlObjectType instanceof GraphQLUnionType) {
    logger.debug(`${LOG_LABEL}: \tObjectType(Union): ${gqlObjectType.name}`);

    return factory.createPropertySignature(
      undefined,
      factory.createIdentifier(gqlObjectType.name),
      undefined,
      factory.createTypeLiteralNode([
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier("__typename"),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeReferenceNode("boolean"),
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier("$on"),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeLiteralNode(
            gqlObjectType.getTypes().map((t) => {
              return factory.createPropertySignature(
                undefined,
                factory.createIdentifier(t.name),
                factory.createToken(SyntaxKind.QuestionToken),
                factory.createTypeReferenceNode(
                  `QueryObjectTypes["${t.name}"]`,
                ),
              );
            }),
          ),
        ),
      ]),
    );
  }

  if (gqlObjectType instanceof GraphQLInterfaceType) {
    logger.debug(
      `${LOG_LABEL}: \tObjectType(Interface): ${gqlObjectType.name}`,
    );

    const fields: GraphQLFieldMap<
      string,
      GraphQLField<any, any>
    > = gqlObjectType.getFields();

    const fieldDeclarations = Object.values(fields)
      .map(resolveQueryFieldType)
      .filter((r): r is TypeElement => !(r == null));

    const queryObjectType = factory.createPropertySignature(
      undefined,
      factory.createIdentifier(gqlObjectType.name),
      undefined,
      factory.createTypeLiteralNode([
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier("$type"),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createLiteralTypeNode(
            factory.createStringLiteral(gqlObjectType.name),
          ),
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier("__typename"),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeReferenceNode("boolean"),
        ),
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier("$on"),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeLiteralNode(
            interfaceImplementsMap[gqlObjectType.name]?.map((t) => {
              return factory.createPropertySignature(
                undefined,
                factory.createIdentifier(t.name),
                factory.createToken(SyntaxKind.QuestionToken),
                factory.createTypeReferenceNode(
                  `QueryObjectTypes["${t.name}"]`,
                ),
              );
            }),
          ),
        ),
        ...fieldDeclarations,
      ]),
    );

    return queryObjectType;
  }

  return null;
};

const resolveQueryFieldType = (
  gqlField: GraphQLField<any, any>,
): TypeElement | null => {
  const argTypes = gqlField.args
    .map(resolveQueryArgumentType)
    .filter((r): r is PropertySignature => !(r == null));

  const { type: gqlFieldValueType } = unwrapType(gqlField.type);

  let fieldType: TypeNode | null = null;
  if (gqlFieldValueType instanceof GraphQLScalarType) {
    fieldType = factory.createTypeReferenceNode("boolean");
  }
  if (gqlFieldValueType instanceof GraphQLEnumType) {
    fieldType = factory.createTypeReferenceNode("boolean");
  }
  if (gqlFieldValueType instanceof GraphQLObjectType) {
    fieldType = factory.createTypeReferenceNode(
      `QueryObjectTypes["${gqlFieldValueType.name}"]`,
    );
  }
  if (gqlFieldValueType instanceof GraphQLUnionType) {
    fieldType = factory.createTypeReferenceNode(
      `QueryObjectTypes["${gqlFieldValueType.name}"]`,
    );
  }
  if (gqlFieldValueType instanceof GraphQLInterfaceType) {
    fieldType = factory.createTypeReferenceNode(
      `QueryObjectTypes["${gqlFieldValueType.name}"]`,
    );
  }

  if (fieldType != null) {
    if (argTypes.length > 0) {
      const requireArgs =
        argTypes.filter((a) => a.questionToken == null).length > 0;

      const additionalProperties = factory.createTypeLiteralNode([
        factory.createPropertySignature(
          undefined,
          factory.createIdentifier("$args"),
          requireArgs
            ? undefined
            : factory.createToken(SyntaxKind.QuestionToken),
          factory.createTypeLiteralNode(argTypes),
        ),
      ]);

      return factory.createPropertySignature(
        undefined,
        factory.createIdentifier(gqlField.name),
        factory.createToken(SyntaxKind.QuestionToken),
        factory.createIntersectionTypeNode([fieldType, additionalProperties]),
      );
    } else {
      return factory.createPropertySignature(
        undefined,
        factory.createIdentifier(gqlField.name),
        factory.createToken(SyntaxKind.QuestionToken),
        fieldType,
      );
    }
  }

  return null;
};

const resolveQueryArgumentType = (gqlArg: GraphQLArgument) => {
  const {
    type: gqlArgValueType,
    nullable,
    list,
    listItemNullable,
  } = unwrapType(gqlArg.type);

  const argValueType = resolveValueType(gqlArgValueType);
  if (argValueType != null) {
    return factory.createPropertySignature(
      undefined,
      factory.createIdentifier(gqlArg.name),
      nullable ? factory.createToken(SyntaxKind.QuestionToken) : undefined,

      factory.createUnionTypeNode([
        factory.createTypeReferenceNode(`V`),
        factory.createTypeLiteralNode([
          factory.createPropertySignature(
            undefined,
            factory.createIdentifier("value"),
            undefined,
            wrapType(argValueType, { nullable, list, listItemNullable }),
          ),
        ]),
      ]),
    );
  }

  return null;
};
