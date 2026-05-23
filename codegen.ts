import type { CodegenConfig } from '@graphql-codegen/cli';
import { config as dotenvConfig } from 'dotenv';
import * as path from 'node:path';

const ENV_DIR = '.env';
const mode = process.env.NODE_ENV ?? 'development';
// Vite-style precedence (highest wins, see https://vite.dev/guide/env-and-mode):
//   .env.<mode>.local  >  .env.<mode>  >  .env.local  >  .env
// dotenv leaves already-set keys untouched, so loading highest priority
// first yields the correct effective value for each key.
dotenvConfig({ path: path.join(ENV_DIR, `.env.${mode}.local`) });
dotenvConfig({ path: path.join(ENV_DIR, `.env.${mode}`) });
dotenvConfig({ path: path.join(ENV_DIR, '.env.local') });
dotenvConfig({ path: path.join(ENV_DIR, '.env') });

const env = process.env;

const args = process.argv.slice(2);
const isDownload = args.includes('--download');

const scalars = {
  DateTime: 'number | string',
  JSON: 'unknown',
  JSONObject: 'Record<string, unknown>',
};

const schemaUrl =
  env.GRAPHQL_SCHEMA_URL ||
  env.REACT_APP_GRAPHQL_SCHEMA_URL ||
  env.GRAPHQL_PROXY_TARGET ||
  env.GRAPHQL_SERVER_URL ||
  env.REACT_APP_GRAPHQL_SERVER_URL;

if (!schemaUrl) {
  throw new Error(
    `codegen.ts: set GRAPHQL_SCHEMA_URL, GRAPHQL_PROXY_TARGET, or REACT_APP_GRAPHQL_SERVER_URL in .env/.env or .env/.env.${mode}`,
  );
}

try {
  const parsedSchemaUrl = new URL(schemaUrl);
  if (!['http:', 'https:'].includes(parsedSchemaUrl.protocol)) {
    throw new Error('unsupported protocol');
  }
} catch {
  throw new Error(`codegen.ts: GraphQL schema URL must be absolute, got ${schemaUrl}`);
}

const config: CodegenConfig = {
  overwrite: true,
  schema: schemaUrl,
  documents: ['src/**/*.graphql'],
  ignoreNoDocuments: true,
  generates: {
    './src/__generated__/schema.graphql': {
      plugins: ['schema-ast'],
      config: { includeDirectives: true },
    },
    ...(isDownload
      ? {}
      : {
          './src/__generated__/graphql-request.ts': {
            plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
            config: {
              onlyOperationTypes: true,
              rawRequest: false,
              skipTypename: true,
              scalars,
            },
          },
        }),
  },
};

export default config;
