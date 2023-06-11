# graqq | Write GraphQL queries in TypeScript

🚧 WIP 🚧

- Fully-Typed: You can construct GraphQL queries with the support of TypeScript's types.
- Client-Agnostic: graqq just generates [TypedDocumentNode](https://github.com/dotansimha/graphql-typed-document-node). You can use any client libraries which support TypedDocumentNode.


## Quick Start

```
npm install -D @graqq/cli
npm install @graqq/core

npx graqq -s schema.graphql -o src/graqq.gen.ts
```

```TS
import { $q } from "./graqq.gen";
import { useQuery } from '@apollo/client';

const VIEWER_QUERY = $q("Viewer")({
  viewer: {
    user: {
      id: true
      bio: true
    }
  }
})

const { loading, data } = useQuery(VIEWER_QUERY);
```

## Similar projects

- [graphql-zeus](https://github.com/graphql-editor/graphql-zeus)
- [genql](https://github.com/remorses/genql)