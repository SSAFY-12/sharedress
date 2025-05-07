import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
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
export default defineConfig({
	plugins: [
		// React HMR 및 JSX 변환 지원
		// PWA(Progressive Web App) 플러그인 설정
		react(), // https 환경을 위한 setting
		// mkcert(), // 타입스크립트/ESLint 실시간 체크 플러그인
		// VitePWA({
		// 	registerType: 'autoUpdate', // 서비스워커가 항상 최신 상태로 자동 업데이트
		// 	injectRegister: 'auto', // 서비스워커 등록 스크립트 자동 삽입
		// 	devOptions: { enabled: true, type: 'module' }, // 개발 모드에서도 PWA 테스트 가능
		// 	includeAssets: [
		// 		'favicon.ico', // 파비콘
		// 		'apple-touch-icon.png', // iOS 홈화면 아이콘
		// 		'favicon-16x16.png',
		// 		'favicon-32x32.png',
		// 		'android-chrome-192x192.png',
		// 		'android-chrome-512x512.png',
		// 	],
		// 	manifest: {
		// 		name: '쉐어드레스', // 앱 전체 이름
		// 		short_name: '쉐어드레스', // 앱 짧은 이름
		// 		description: 'share + dress, share + address', // 앱 설명
		// 		theme_color: '#242424', // 앱 테마 색상(상단바 등)
		// 		background_color: '#ffffff', // 앱 배경색
		// 		display: 'standalone', // 앱처럼 보이게(상태바 등은 보임)
		// 		orientation: 'portrait-primary', // 세로모드 고정
		// 		start_url: '/', // 앱 시작 경로
		// 		scope: '/', // PWA 적용 범위
		// 		icons: [
		// 			{
		// 				src: '/android-chrome-192x192.png',
		// 				sizes: '192x192',
		// 				type: 'image/png',
		// 				purpose: 'any maskable', // 마스커블 아이콘 지원
		// 			},
		// 			{
		// 				src: '/android-chrome-512x512.png',
		// 				sizes: '512x512',
		// 				type: 'image/png',
		// 				purpose: 'any maskable',
		// 			},
		// 		],
		// 	},
		// 	workbox: {
		// 		disableDevLogs: true,
		// 		clientsClaim: true, // 새 서비스워커가 즉시 모든 탭을 제어
		// 		skipWaiting: true, // 새 서비스워커가 대기 없이 즉시 활성화
		// 		globPatterns: ['**/*.{js,css,html,woff2,png,jpg,svg,mp4}'], // precache할 파일 확장자
		// 		// 필요하다면 runtimeCaching 등 추가 가능 => API 생성 후 추가 권장
		// 	},
		// }),
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
		// https: true,
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
				// 프론트에서 /api로 시작하는 요청을 아래 설정대로 프록시
				target: 'http://70.12.246.84:8080', // 실제 백엔드 서버 주소
				changeOrigin: true, // CORS 우회(Origin 헤더 변경)
				secure: false, // HTTPS 인증서 검증 생략(개발용)
				// rewrite: (path) => path.replace(/^\/api/, ''), // 백엔드가 /api 필요 없으면 주석 해제
				// configure: (proxy, _options) => {
				//   proxy.on('proxyRes', (proxyRes, req, res) => {
				//     // 쿠키 헤더 로깅 등 디버깅 가능
				//     console.log('쿠키 헤더:', proxyRes.headers['set-cookie']);
				//   });
				// },
			},
		},
	},

	build: {
		sourcemap: true,
	},
});
