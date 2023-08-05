import * as ts from "typescript";

import { type GraphQLSchema } from "graphql";

import {
  resolveInputObjectTypes,
  resolveObjectTypes,
} from "./resolveObjectTypes";
import { resolveQueryObjectTypes } from "./resolveQueryObjectTypes";

import * as fs from "fs";
import * as path from "path";
import { type ScalarsConfig } from "./config";
import { resolveTypeMap } from "./resolveTypeMap";

type GenerateInput = {
  schema: GraphQLSchema;
  scalars: ScalarsConfig;
};

/**
 * Generates a code from a GraphQL schema.
 *
 * @param input
 * @returns a generated code
 */
export const generate = async ({
  schema,
  scalars,
}: GenerateInput): Promise<string> => {
  const objectTypes = Object.values(schema.getTypeMap()).filter(
    (o) => !o.name.startsWith("__"),
  );
  const objectTypeNodes = resolveObjectTypes(objectTypes, { scalars });
  const inputObjectTypeNodes = resolveInputObjectTypes(objectTypes, {
    scalars,
  });
  const queryObjectTypeNodes = resolveQueryObjectTypes(objectTypes);
  const typeMapNodes = resolveTypeMap(objectTypes);

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const output = printer.printList(
    ts.ListFormat.MultiLine,
    ts.factory.createNodeArray([
      ...objectTypeNodes,
      ...inputObjectTypeNodes,
      ...queryObjectTypeNodes,
      ...typeMapNodes,
    ]),
    ts.createSourceFile(
      "output.ts",
      "",
      ts.ScriptTarget.Latest,
      false,
      ts.ScriptKind.TS,
    ),
  );

  const runtimeCode = await getRuntimeCode();

  return `${runtimeCode}\n\n${output}`;
};

const getRuntimeCode = async (): Promise<string> => {
  const filePath = path.resolve(__dirname, "../src/_runtime_code.ts");
  const runtimeCodeBuf = await fs.promises.readFile(filePath);

  return runtimeCodeBuf
    .toString()
    .replace(/\/\* DELETE_START.*DELETE_END \*\//ms, "");
};
