import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { portfolioMetadata } from './scripts/portfolio-metadata.ts';

export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [
    react(),
    portfolioMetadata(mode === 'standalone'),
    ...(mode === 'standalone' ? [viteSingleFile()] : []),
  ],
  server: {
    port: 5173,
    strictPort: true,
    watch: { usePolling: process.env.VITE_USE_POLLING === 'true' },
  },
  build: {
    outDir: mode === 'standalone' ? 'dist-standalone' : 'dist',
    copyPublicDir: mode !== 'standalone',
    ...(mode !== 'standalone'
      ? {
          rolldownOptions: {
            output: {
              codeSplitting: { groups: [{ name: 'vendor', test: /node_modules/ }] },
            },
          },
        }
      : {}),
  },
}));
