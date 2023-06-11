/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type ResultOf,
  type VariablesOf,
} from "@graphql-typed-document-node/core";
import type { Assert } from "@graqq/testutil";
import { $q } from "./graqq.gen";

export const querySimple0 = $q("Viewer")({
  viewer: {
    user: {
      id: true,
      bio: true,
    },
  },
  tags: true,
});

type ResultQuerySimple0 = ResultOf<typeof querySimple0>;
type VarQuerySimple0 = VariablesOf<typeof querySimple0>;
// console.log(print(querySimple0));

const testQuerySimple0ResultType: Assert<
  ResultQuerySimple0,
  {
    viewer: {
      user: {
        id: string;
        bio: string | null;
      };
    } | null;
    tags: string[];
  }
> = true;
const testQuerySimple0VariablesType: Assert<VarQuerySimple0, {}> = true;

export const queryWithArgs0 = $q("UserByUserName", {
  uname: "String!",
})({
  user: {
    $args: {
      // username: { value: "test" },
      username: "uname",
    },
    id: true,
    bio: true,
    favoriteArticles: {
      edges: {
        node: {
          id: true,
          title: true,
          createdAt: true,
        },
      },
    },
  },
});

type ResultQueryWithArgs0 = ResultOf<typeof queryWithArgs0>;
type VarQueryWithArgs0 = VariablesOf<typeof queryWithArgs0>;
// console.log(print(queryWithArgs0));

const testQueryWithArgs0ResultType: Assert<
  ResultQueryWithArgs0,
  {
    user: {
      id: string;
      favoriteArticles: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            createdAt: string;
          } | null;
        } | null> | null;
      };
      bio: string | null;
    } | null;
  }
> = true;

const testQueryWithArgs0VariablesType: Assert<
  VarQueryWithArgs0,
  {
    uname: string;
  }
> = true;
