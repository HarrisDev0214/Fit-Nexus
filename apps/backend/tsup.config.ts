import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/bin/www.ts'],
  format: ['esm'],
  target: 'node22',
  outDir: 'dist',
  clean: true,
  sourcemap: false,
  minify: true
});
