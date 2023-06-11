import {
  Kind,
  OperationTypeNode,
  parseType,
  type ArgumentNode,
  type DocumentNode,
  type ExecutableDefinitionNode,
  type FieldNode,
  type InlineFragmentNode,
  type ObjectFieldNode,
  type SelectionNode,
  type ValueNode,
  type VariableDefinitionNode,
} from "graphql";

import { type Variables } from "./types";

type QueryObject = Record<string, any>; // TODO

type FieldTypeDef = {
  type: string;
  typeName: string;
  nullable: boolean;
  list: boolean;
  listItemNullable: boolean;
};
type ObjectFieldTypeDef = FieldTypeDef & {
  $args?: Record<string, FieldTypeDef>;
};
type ObjectTypeDef = Record<string, ObjectFieldTypeDef>;
type TypeMap = Record<string, ObjectTypeDef>;

type Context<G> = {
  typeMap: TypeMap;
  variables?: Variables<G>;
};

export const buildOperationDocumentNode = (
  operationName: string,
  operationType: "query" | "mutation",
  context: Context<any>,
) => {
  return (query: QueryObject) => {
    const { variables } = context;
    const queryNode: ExecutableDefinitionNode = {
      kind: Kind.OPERATION_DEFINITION,
      operation:
        operationType === "query"
          ? OperationTypeNode.QUERY
          : OperationTypeNode.MUTATION,
      name: {
        kind: Kind.NAME,
        value: operationName,
      },
      variableDefinitions:
        variables != null
          ? Object.keys(variables).map((name) =>
              buildVariableNode(name, variables[name]),
            )
          : [],
      selectionSet: {
        kind: Kind.SELECTION_SET,
        selections: buildSelectionNodes(
          query,
          context,
          operationType === "query" ? "Query" : "Mutation",
        ),
      },
    };

    const documentNode: DocumentNode = {
      kind: Kind.DOCUMENT,
      definitions: [queryNode],
    };

    return documentNode;
  };
};

const buildVariableNode = (
  name: string,
  typeExpression: string,
): VariableDefinitionNode => {
  return {
    kind: Kind.VARIABLE_DEFINITION,
    variable: {
      kind: Kind.VARIABLE,
      name: {
        kind: Kind.NAME,
        value: name,
      },
    },
    type: parseType(typeExpression),
  };
};

export const buildSelectionNodes = (
  query: QueryObject,
  context: Context<any>,
  typeMapObjectKey: string,
): SelectionNode[] => {
  let ret: SelectionNode[] = [];

  const { typeMap } = context;
  const names = Object.keys(query).filter((k) => !k.startsWith("$"));
  const objectTypeMap = typeMap[typeMapObjectKey];

  const nodes = names
    .map((name) => {
      const value = query[name];
      const fieldTypeDef = objectTypeMap[name];
      return buildFieldNode(name, value, fieldTypeDef, context);
    })
    .filter((n): n is FieldNode => !(n == null));

  ret = [...ret, ...nodes];

  if ("$on" in query) {
    const objectTypes = Object.keys(query.$on);

    const inlineFragmentNodes = objectTypes.map(
      (objectType): InlineFragmentNode => {
        return {
          kind: Kind.INLINE_FRAGMENT,
          typeCondition: {
            kind: Kind.NAMED_TYPE,
            name: {
              kind: Kind.NAME,
              value: objectType,
            },
          },
          selectionSet: {
            kind: Kind.SELECTION_SET,
            selections: buildSelectionNodes(
              query.$on[objectType],
              context,
              objectType,
            ),
          },
        };
      },
    );

    ret = [...ret, ...inlineFragmentNodes];
  }

  return ret;
};

const buildFieldNode = (
  name: string,
  value: QueryObject | boolean,
  fieldTypeDef: ObjectFieldTypeDef,
  context: Context<any>,
) => {
  const { variables } = context;
  if (typeof value === "boolean") {
    if (value) {
      const node: FieldNode = {
        kind: Kind.FIELD,
        name: {
          kind: Kind.NAME,
          value: name,
        },
      };
      return node;
    }
    return null;
  }

  let argNodes: readonly ArgumentNode[] = [];
  if ("$args" in value) {
    const args = value.$args;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const argsTypeMap = fieldTypeDef.$args!;
    argNodes = Object.keys(args)
      .map((k) => {
        const arg = args[k];
        const argTypeDef = argsTypeMap[k];
        if (typeof arg === "string" && typeof variables?.[arg] === "string") {
          return {
            kind: Kind.ARGUMENT,
            name: {
              kind: Kind.NAME,
              value: k,
            },
            value: {
              kind: Kind.VARIABLE,
              name: {
                kind: Kind.NAME,
                value: arg,
              },
            },
          };
        }
        if ("value" in arg) {
          const argValue = arg.value;
          return {
            kind: Kind.ARGUMENT,
            name: {
              kind: Kind.NAME,
              value: k,
            },
            value: buildValueNode(argValue, argTypeDef, context),
          };
        }

        return null;
      })
      .filter((a): a is ArgumentNode => !(a == null));
  }
  const node: FieldNode = {
    kind: Kind.FIELD,
    name: {
      kind: Kind.NAME,
      value: name,
    },
    arguments: argNodes,
    selectionSet: {
      kind: Kind.SELECTION_SET,
      selections: buildSelectionNodes(value, context, fieldTypeDef.typeName),
    },
  };

  return node;
};

const buildValueNode = (
  value: unknown,
  argTypeDef: FieldTypeDef,
  context: Context<any>,
): ValueNode => {
  const { typeMap } = context;
  if (argTypeDef.nullable && value == null) {
    return {
      kind: Kind.NULL,
    };
  }

  if (argTypeDef.list && Array.isArray(value)) {
    const listValue = value as unknown[];
    const listItemTypeDef = {
      ...argTypeDef,
      list: false,
    };
    const valuesNodes = listValue.map((listItemValue) =>
      buildValueNode(listItemValue, listItemTypeDef, context),
    );
    return {
      kind: Kind.LIST,
      values: valuesNodes,
    };
  }

  if (
    argTypeDef.type === "InputObject" &&
    value != null &&
    typeof value === "object"
  ) {
    const inputObjectValue = value as Record<string, any>;
    const inputObjectTypeDef = typeMap[argTypeDef.typeName];
    const fieldsNodes = Object.keys(inputObjectValue)
      .map((inputObjectField): ObjectFieldNode | null => {
        if (inputObjectField in value) {
          const inputObjectFieldValue = inputObjectValue[inputObjectField];
          const inputObjectFieldTypeDef = inputObjectTypeDef[inputObjectField];
          if (inputObjectFieldTypeDef != null) {
            return {
              kind: Kind.OBJECT_FIELD,
              name: {
                kind: Kind.NAME,
                value: inputObjectField,
              },
              value: buildValueNode(
                inputObjectFieldValue,
                inputObjectFieldTypeDef,
                context,
              ),
            };
          }
        }

        return null;
      })
      .filter((f): f is ObjectFieldNode => f != null);

    return {
      kind: Kind.OBJECT,
      fields: fieldsNodes,
    };
  }
  if (argTypeDef.type === "Scalar" && value != null) {
    return buildScalarValueNode(value, argTypeDef.typeName);
  }
  if (
    argTypeDef.type === "Enum" &&
    value != null &&
    typeof value === "string"
  ) {
    return {
      kind: Kind.ENUM,
      value,
    };
  }

  throw new Error("not implemented");
};

const buildScalarValueNode = (value: unknown, typeName: string): ValueNode => {
  if (typeName === "String" && typeof value === "string") {
    return {
      kind: Kind.STRING,
      value,
    };
  }
  if (typeName === "ID" && typeof value === "string") {
    return {
      kind: Kind.STRING,
      value,
    };
  }
  if (typeName === "Int" && typeof value === "number") {
    return {
      kind: Kind.INT,
      value: value.toString(),
    };
  }
  if (typeName === "Float" && typeof value === "number") {
    return {
      kind: Kind.FLOAT,
      value: value.toString(),
    };
  }
  if (typeName === "Boolean" && typeof value === "boolean") {
    return {
      kind: Kind.BOOLEAN,
      value,
    };
  }

  // If the typeName is not a built-in scalar type, use the type of the value itself.
  if (typeof value === "number") {
    if (Number.isInteger(value)) {
      return {
        kind: Kind.INT,
        value: value.toString(),
      };
    } else {
      return {
        kind: Kind.FLOAT,
        value: value.toString(),
      };
    }
  }
  if (typeof value === "boolean") {
    return {
      kind: Kind.BOOLEAN,
      value,
    };
  }
  if (typeof value === "string") {
    return {
      kind: Kind.STRING,
      value,
    };
  }

  throw new Error("not implemented");
};
