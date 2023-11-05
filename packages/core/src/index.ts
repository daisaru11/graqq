export type { TypedDocumentNode } from "@graphql-typed-document-node/core";
export {
  addTypenameRecursive,
  applyAddTypenameRecursiveToFields,
} from "./addTypenameRecursive";
export { buildOperationDocumentNode } from "./buildDocumentNode";
export type {
  AddTypenameRecursive,
  ApplyAddTypenameRecursiveToFields,
  MapGraphQLType,
  MapVariablesType,
  Variables,
} from "./types";
