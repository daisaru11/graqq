/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type ResultOf,
  type VariablesOf,
} from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $m, type AddCommentInput } from "./graqq.gen";

export const mutationSimple0 = $m("AddComment")({
  addComment: {
    $args: {
      input: {
        value: {
          articleId: "testId",
          body: "testBody",
        },
      },
    },
    comment: {
      id: true,
      body: true,
    },
  },
});

type ResultMutationSimple0 = ResultOf<typeof mutationSimple0>;
type VarMutationSimple0 = VariablesOf<typeof mutationSimple0>;
// console.log(print(mutationSimple0));

const testMutationSimple0ResultType: Assert<
  ResultMutationSimple0,
  {
    addComment: {
      __typename: "AddCommentPayload";
      comment: {
        __typename: "Comment";
        id: string;
        body: string;
      } | null;
    } | null;
  }
> = true;
const testMutationSimple0VariablesType: Assert<VarMutationSimple0, {}> = true;

export const mutationWithArgs0 = $m("AddComment", {
  input: "AddCommentInput!",
})({
  addComment: {
    $args: {
      input: "input",
    },
    comment: {
      id: true,
      body: true,
    },
  },
});

type ResultMutationWithArgs0 = ResultOf<typeof mutationWithArgs0>;
type VarMutationWithArgs0 = VariablesOf<typeof mutationWithArgs0>;
// console.log(print(mutationWithArgs0));

const testMutationWithArgs0ResultType: Assert<
  ResultMutationWithArgs0,
  {
    addComment: {
      __typename: "AddCommentPayload";
      comment: {
        __typename: "Comment";
        id: string;
        body: string;
      } | null;
    } | null;
  }
> = true;
const testMutationWithArgs0VariablesType: Assert<
  VarMutationWithArgs0,
  {
    input: AddCommentInput;
  }
> = true;
