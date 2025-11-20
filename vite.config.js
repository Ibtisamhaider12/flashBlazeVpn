import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Plugin to copy manifest and icons after build, and fix HTML paths
const copyManifestPlugin = () => {
  return {
    name: 'copy-manifest',
    writeBundle() {
      const distDir = resolve(__dirname, 'dist');
      const publicDir = resolve(__dirname, 'public');
      
      // Copy manifest.json
      if (existsSync(resolve(__dirname, 'manifest.json'))) {
        copyFileSync(
          resolve(__dirname, 'manifest.json'),
          resolve(distDir, 'manifest.json')
        );
      }
      
      // Ensure icons directory exists
      const iconsDir = resolve(distDir, 'icons');
      if (!existsSync(iconsDir)) {
        mkdirSync(iconsDir, { recursive: true });
      }
      
      // Generate icons if they don't exist or regenerate all to ensure they're valid
      const iconScript = resolve(__dirname, 'scripts', 'create_icons_simple.py');
      if (existsSync(iconScript)) {
        try {
          execSync(`python3 "${iconScript}"`, { stdio: 'inherit', cwd: __dirname });
        } catch (error) {
          console.warn('Warning: Could not generate icons automatically. Please run: python3 scripts/create_icons_simple.py');
        }
      }
      
      // Also copy from public/icons if they exist (as backup)
      if (existsSync(resolve(publicDir, 'icons'))) {
        const iconFiles = ['icon16.png', 'icon48.png', 'icon128.png'];
        iconFiles.forEach(icon => {
          const src = resolve(publicDir, 'icons', icon);
          const dest = resolve(iconsDir, icon);
          if (existsSync(src)) {
            // Only copy if destination doesn't exist or source is newer
            if (!existsSync(dest)) {
              copyFileSync(src, dest);
            }
          }
        });
      }
      
      // Fix popup.html paths - change absolute paths to relative paths
      const popupHtmlPath = resolve(distDir, 'src', 'popup.html');
      if (existsSync(popupHtmlPath)) {
        let htmlContent = readFileSync(popupHtmlPath, 'utf-8');
        // Replace absolute paths with relative paths
        htmlContent = htmlContent.replace(/src="\/popup\.js"/g, 'src="../popup.js"');
        htmlContent = htmlContent.replace(/href="\/assets\//g, 'href="../assets/');
        writeFileSync(popupHtmlPath, htmlContent, 'utf-8');
      }
    }
  };
};

export default defineConfig({
  plugins: [react(), copyManifestPlugin()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup.html'),
        background: resolve(__dirname, 'src/background.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});

