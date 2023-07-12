import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../backend/src/schema.graphql',
  documents: ['src/**/*.gql'],
  generates: {
    './src/graphql/index.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        exposeQueryKeys: true,
        exposeMutationKeys: true,
        fetcher: {
          func: './fetcher.ts#graphqlFetcher',
          isReactHook: false, // optional, defaults to false, controls the function's signature. Read below
        },
      },
    },
  },
};
export default config;
