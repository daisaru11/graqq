/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Assert } from "@graqq/testutil";
import { $fieldsOf, type InferFields } from "./graqq.gen";

const articleFields = $fieldsOf("Article")({
  author: {
    id: true,
  },
  body: true,
});

type Article = InferFields<typeof articleFields>;

const testArticleType: Assert<
  Article,
  {
    __typename: "Article";
    author: {
      __typename: "User";
      id: string;
    } | null;
    body: string;
  }
> = true;
