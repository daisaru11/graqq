# graqq | Write GraphQL queries in TypeScript

- Fully-Typed: You can construct GraphQL queries with the support of TypeScript's types.
- Client-Agnostic: graqq just generates [TypedDocumentNode](https://github.com/dotansimha/graphql-typed-document-node). You can use any client libraries which support TypedDocumentNode.


## Quick Start

```
npm i -D @graqq/cli
npm i @graqq/core

npx graqq -s schema.graphql -o src/graqq.gen.ts
```

```TS
import { $q } from "./graqq.gen";
import { useQuery } from '@apollo/client';

const VIEWER_QUERY = $q("Viewer")({
  viewer: {
    user: {
      id: true,
      bio: true,
    }
  }
})

const { loading, data } = useQuery(VIEWER_QUERY);
```

## Query Usage

### Query with literal value arguments

```TS
import { $q } from "./graqq.gen";

export const GET_ARTICLE = $q("GetArticle")({
  article: {
    $args: {
      id: { value: 'foo' },
    },
    author: {
      name: true
    }
    body: true
    createdAt: true
  }
})
```

### Query with variable arguments

```TS
import { $q } from "./graqq.gen";

export const GET_ARTICLE = $q("GetArticleBySlug", {
  articleSlug: "String!"
})({
  articleBySlug: {
    $args: {
      slug: 'articleSlug'
    },
    author: {
      name: true
    }
    body: true
    createdAt: true
  }
})

// pass the variable value to the client
const { loading, data } = useQuery(GET_ARTICLE, {
  variables: {
    articleSlug: 'foo'
  }
});
```

### Mutation

```TS
import { $m } from "./graqq.gen";

export const ADD_COMMENT = $m("AddComment", {
  input: 'AddCommentInput!'
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
})
```

### Reuseable object query

Since graqq queries are pure object literals, they can be easily reused, similar to GraphQL Fragments.

Here's an example of defining the fields you want to query together with the React CommentCard component:

```TSX
import { $fieldsOf, type InferFields } from "./graqq.gen";

// Define fields for CommentCard component.
export const commentFields = $fieldsOf("Comment")({
  body: true,
  createdAt: true,
});
type Comment = InferFields<typeof commentFields>; // Type inference

export const CommentCard: React.FC<{comment: Comment}> = ({comment}) => (
  <div className="card">{comment.createdAt} - {comment.body}</div>
)
```

The fields object defined above can be merged when executing a query.

This feature can be used in a manner similar to Fragment Colocation, making it easier to manage the data handled by the query.

```TSX
import { commentFields, CommentCard } from './CommentCard'

export const GET_ARTICLE = $q("GetArticle")({
  article: {
    $args: {
      id: { value: 'foo' },
    },
    id: true,
    comments: {
      ...commentFields
    }
  }
})

// ... 

{data.article.comments.map(comment => (<CommentCard comment={comment} />))}
```

## Similar projects

- [graphql-zeus](https://github.com/graphql-editor/graphql-zeus)
- [genql](https://github.com/remorses/genql)