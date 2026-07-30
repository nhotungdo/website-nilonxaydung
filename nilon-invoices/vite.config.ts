import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

export default defineConfig({
  root: path.resolve(__dirname, 'src/renderer'),
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@main': path.resolve(__dirname, './src/main'),
      '@renderer': path.resolve(__dirname, './src/renderer'),
    },
  },
  plugins: [
    react(),
    electron([
      {
        // Main process entry file of the Electron App.
        entry: path.resolve(__dirname, 'src/main/electron/main.ts'),
        vite: {
          build: {
            outDir: path.resolve(__dirname, 'dist/main'),
            minify: process.env.NODE_ENV === 'production',
            rollupOptions: {
              external: ['better-sqlite3', 'pdf-to-printer', 'bufferutil', 'utf-8-validate', 'pg', 'pg-native'],
            },
          },
          optimizeDeps: {
            exclude: ['pg-native'],
          },
        },
      },
      {
        entry: path.resolve(__dirname, 'src/main/electron/preload.ts'),
        onstart(options) {
          options.reload();
        },
        vite: {
          build: {
            outDir: path.resolve(__dirname, 'dist/main'),
            minify: process.env.NODE_ENV === 'production',
            rollupOptions: {
              external: ['pg-native'],
            },
          },
          optimizeDeps: {
            exclude: ['pg-native'],
          },
        },
      },
    ]),
    renderer(),
  ],
  optimizeDeps: {
    exclude: ['pg-native'],
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/renderer'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/renderer/index.html'),
      external: ['pg-native'],
    },
  },
});

