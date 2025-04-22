import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		checker({
			typescript: true,
			eslint: {
				lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
				dev: { logLevel: ['error', 'warning'] },
			},
		}),
	],
	css: {
		postcss: {
			plugins: [tailwindcss, autoprefixer],
		},
	},
	resolve: {
		alias: { '@': path.resolve(__dirname, './src') },
	},
});
