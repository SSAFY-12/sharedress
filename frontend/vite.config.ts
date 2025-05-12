import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';
import mkcert from 'vite-plugin-mkcert';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';

const cspHeader = [
	// 기본 설정
	"default-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: data:", // FCM 푸시 알림 기본 설정

	// 스크립트 설정
	"script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:", // FCM 푸시 알림 스크립트 설정

	// 스타일 설정
	"style-src 'self' 'unsafe-inline' https: http:", // FCM 푸시 알림 스타일 설정

	// 이미지 설정
	"img-src 'self' data: https: http:", // FCM 푸시 알림 이미지 설정

	// 폰트 설정
	"font-src 'self' data: https: http:", // FCM 푸시 알림 폰트 설정

	// 프레임 설정
	"frame-src 'self' https: http:", // FCM 푸시 알림 프레임 설정

	// 웹소켓 등 연결 설정 (Vite HMR을 위해 필요)
	"connect-src 'self' ws: wss: https: http:", // FCM 푸시 알림 웹소켓 설정

	// 워커 설정 (PWA를 위해 필요)
	"worker-src 'self' blob:", // FCM 푸시 알림 워커 설정

	// 매니페스트 설정
	"manifest-src 'self'", // FCM 푸시 알림 매니페스트 설정
].join('; ');

// Vite 설정 파일
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const isDevelopment = mode === 'development';

	// Service Worker 파일 생성
	const swContent = `
		importScripts(
			'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
		);
		importScripts(
			'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js',
		);

		firebase.initializeApp({
			apiKey: '${env.VITE_FIREBASE_API_KEY}',
			authDomain: '${env.VITE_FIREBASE_AUTH_DOMAIN}',
			projectId: '${env.VITE_FIREBASE_PROJECT_ID}',
			storageBucket: '${env.VITE_FIREBASE_STORAGE_BUCKET}',
			messagingSenderId: '${env.VITE_FIREBASE_MESSAGING_SENDER_ID}',
			appId: '${env.VITE_FIREBASE_APP_ID}',
		});

		const messaging = firebase.messaging();

		messaging.onBackgroundMessage((payload) => {
			console.log('백그라운드 메시지 수신:', payload);

			const notificationTitle = payload.notification.title;
			const notificationOptions = {
				body: payload.notification.body,
				icon: '/android-chrome-192x192.png',
				badge: '/favicon-32x32.png',
				data: payload.data,
			};

			self.registration.showNotification(notificationTitle, notificationOptions);
		});
	`;

	// 빌드 시점에 Service Worker 파일 생성
	if (mode === 'production') {
		fs.writeFileSync(
			path.resolve(__dirname, 'public/firebase-messaging-sw.js'),
			swContent,
		);
	}

	return {
		plugins: [
			react(),
			mkcert(),
			VitePWA({
				registerType: 'autoUpdate',
				injectRegister: false,
				devOptions: { enabled: true, type: 'module' },
				includeAssets: [
					'favicon.ico',
					'apple-touch-icon.png',
					'favicon-16x16.png',
					'favicon-32x32.png',
					'android-chrome-192x192.png',
					'android-chrome-512x512.png',
				],
				manifest: {
					name: '쉐어드레스',
					short_name: '쉐어드레스',
					description: 'share + dress, share + address',
					theme_color: '#242424',
					background_color: '#ffffff',
					display: 'standalone',
					orientation: 'portrait-primary',
					start_url: '/',
					scope: '/',
					icons: [
						{
							src: '/android-chrome-192x192.png',
							sizes: '192x192',
							type: 'image/png',
							purpose: 'any maskable',
						},
						{
							src: '/android-chrome-512x512.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'any maskable',
						},
					],
				},
				workbox: {
					disableDevLogs: true,
					clientsClaim: true,
					skipWaiting: true,
					globPatterns: ['**/*.{js,css,html,woff2,png,jpg,svg,mp4}'],
				},
			}),
			checker({
				typescript: true,
				eslint: {
					lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
					dev: { logLevel: ['error', 'warning'] },
				},
			}),
			sentryVitePlugin({
				org: 'ssafy-d6',
				project: 'javascript-react',
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
		server: {
			https: true,
			port: 5173,
			headers: {
				'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
				'Cross-Origin-Embedder-Policy': 'credentialless',
				'Referrer-Policy': 'strict-origin-when-cross-origin',
				'Access-Control-Allow-Origin': '*',
				'Cross-Origin-Resource-Policy': 'cross-origin',
				'Content-Security-Policy': cspHeader,
			},
			proxy: {
				'/api': {
					target: 'http://www.sharedress.co.kr',
					changeOrigin: true,
					secure: false,
				},
			},
		},
		build: {
			sourcemap: true,
			rollupOptions: {
				input: {
					main: path.resolve(__dirname, 'index.html'),
					'service-worker': path.resolve(
						__dirname,
						'public/firebase-messaging-sw.js',
					),
				},
			},
			outDir: 'dist',
			assetsDir: 'assets',
			base: '/',
		},
		define: {
			'process.env': process.env,
		},
	};
});
