import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { EXTENSION } from './config';
import manifestJson from './src/manifest.json';
import tailwindcss from '@tailwindcss/vite';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'generate-manifest',
      closeBundle() {
        // Get dynamic values from environment variables or custom logic

        // Path to the dist folder
        const distDir = path.resolve('./dist');

        // Create the manifest object with dynamic values
        const manifest = {
          name: EXTENSION.name,
          description: EXTENSION.description,
          ...manifestJson,
        };
        if (!fs.existsSync(distDir)) {
          fs.mkdirSync(distDir);
        }
        // Write the generated manifest to the dist folder
        try {
          // Write the generated manifest to the dist folder
          fs.writeFileSync(path.join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
          console.log(`Manifest generated successfully at ${distDir}`);
        } catch (err) {
          console.error('Error writing manifest.json:', err);
        }
      },
    },
  ],
  build: {
    outDir: 'dist', // Define output directory
    rollupOptions: {
      input: {
        popup: 'index.html',
        options: 'options.html',
        background: 'backend/background.js',
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  server: {
    open: true, // Automatically open browser
  },
  resolve: {
    alias: {
      '@src': '/src', // Alias to easily import from the src folder
    },
  },
});
