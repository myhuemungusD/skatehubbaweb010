import { build } from 'esbuild';

// ESBuild configuration for server bundling
const config = {
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/server.js',
  format: 'cjs',
  packages: 'external', // This automatically excludes all Node.js built-ins
  external: [
    // Keep external packages that we still want to exclude specifically
    '@neondatabase/serverless',
    'pg',
    'ws'
  ],
  target: 'node18',
  minify: false,
  sourcemap: true,
};

build(config).catch(() => process.exit(1));