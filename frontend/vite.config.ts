import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';
import mkcert from 'vite-plugin-mkcert';
import { VitePWA } from 'vite-plugin-pwa';

const cspHeader = [
	// 기본 설정
	"default-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: data:",

	// 스크립트 설정
	"script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:",

	// 스타일 설정
	"style-src 'self' 'unsafe-inline' https: http:",

	// 이미지 설정
	"img-src 'self' data: https: http:",

	// 폰트 설정
	"font-src 'self' data: https: http:",

	// 프레임 설정
	"frame-src 'self' https: http:",

	// 웹소켓 등 연결 설정 (Vite HMR을 위해 필요)
	"connect-src 'self' ws: wss: https: http:",

	// 워커 설정 (PWA를 위해 필요)
	"worker-src 'self' blob:",

	// 매니페스트 설정
	"manifest-src 'self'",
].join('; ');

// Vite 설정 파일
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const isDevelopment = mode === 'development';

	return {
		plugins: [
			// React HMR 및 JSX 변환 지원
			// PWA(Progressive Web App) 플러그인 설정
			react(), // https 환경을 위한 setting
			mkcert(), // 타입스크립트/ESLint 실시간 체크 플러그인
			VitePWA({
				registerType: 'autoUpdate',
				injectRegister: 'auto',
				devOptions: {
					enabled: true,
					type: 'classic',
				},
				strategies: 'injectManifest',
				srcDir: 'src',
				filename: 'sw.js',
				workbox: {
					disableDevLogs: true,
					clientsClaim: true,
					skipWaiting: true,
					globPatterns: ['**/*.{js,css,html,woff2,png,jpg,svg,mp4}'],
				},
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
				includeAssets: [
					'favicon.ico',
					'apple-touch-icon.png',
					'favicon-16x16.png',
					'favicon-32x32.png',
					'android-chrome-192x192.png',
					'android-chrome-512x512.png',
				],
			}),
			checker({
				typescript: true, // 타입스크립트 타입 체크
				eslint: {
					lintCommand: 'eslint "./src/**/*.{ts,tsx}"', // ESLint 검사 명령어
					dev: { logLevel: ['error', 'warning'] }, // 에러/경고만 표시
				},
			}),
			sentryVitePlugin({
				org: 'ssafy-d6',
				project: 'javascript-react',
			}),
		],

		css: {
			postcss: {
				plugins: [tailwindcss, autoprefixer], // TailwindCSS와 브라우저 접두사 자동 추가
			},
		},

		resolve: {
			alias: { '@': path.resolve(__dirname, './src') }, // @로 src 경로 별칭
		},

		server: {
			https: true,
			port: 5173,
			headers: {
				'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
				'Cross-Origin-Embedder-Policy': 'credentialless',
				'Referrer-Policy': 'strict-origin-when-cross-origin',
				'Access-Control-Allow-Origin': isDevelopment
					? 'https://localhost:5173'
					: 'https://www.sharedress.co.kr',
				'Access-Control-Allow-Credentials': 'true',
				'Cross-Origin-Resource-Policy': 'cross-origin',
				'Content-Security-Policy': cspHeader,
			},
			proxy: isDevelopment
				? {
						'/api': {
							target: 'https://www.sharedress.co.kr',
							changeOrigin: true,
							secure: false,
							cookieDomainRewrite: 'localhost',
							cookiePathRewrite: '/',
							configure: (proxy, _options) => {
								proxy.on('proxyReq', (proxyReq, req, res) => {
									const cookies = req.headers.cookie;
									console.log('🔍 Proxy Request:', {
										url: req.url,
										method: req.method,
										headers: proxyReq.getHeaders(),
										hasCookies: !!cookies,
										cookies,
										cookieHeader: proxyReq.getHeader('cookie'),
									});
								});

								proxy.on('proxyRes', (proxyRes, req, res) => {
									const setCookie = proxyRes.headers['set-cookie'];
									console.log('🔍 Proxy Response:', {
										url: req.url,
										status: proxyRes.statusCode,
										hasSetCookie: !!setCookie,
										setCookie,
										headers: proxyRes.headers,
										rawHeaders: proxyRes.rawHeaders,
									});

									if (setCookie) {
										console.log('🍪 Set-Cookie 헤더:', setCookie);
									}
								});
							},
						},
				  }
				: undefined,
		},

		build: {
			sourcemap: true,
		},
	};
});
