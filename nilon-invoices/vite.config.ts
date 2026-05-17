import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

export default defineConfig({
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
        entry: 'src/main/electron/main.ts',
        vite: {
          build: {
            outDir: 'dist/main',
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
        entry: 'src/main/electron/preload.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Script build is complete.
          options.reload();
        },
        vite: {
          build: {
            outDir: 'dist/main',
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
    // Enables Node.js integration inside the Renderer-Process.

  ],
  optimizeDeps: {
    exclude: ['pg-native'],
  },
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/renderer/index.html'),
      },
      external: ['pg-native'],
    },
  },
});
