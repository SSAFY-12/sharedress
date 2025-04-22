import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

// Vite 설정 파일
export default defineConfig({
	plugins: [
		react(), // React HMR 및 JSX 변환 지원

		// PWA(Progressive Web App) 플러그인 설정
		VitePWA({
			registerType: 'autoUpdate', // 서비스워커가 항상 최신 상태로 자동 업데이트
			injectRegister: 'auto', // 서비스워커 등록 스크립트 자동 삽입
			devOptions: { enabled: true, type: 'module' }, // 개발 모드에서도 PWA 테스트 가능
			includeAssets: [
				'favicon.ico', // 파비콘
				'apple-touch-icon.png', // iOS 홈화면 아이콘
				'favicon-16x16.png',
				'favicon-32x32.png',
				'android-chrome-192x192.png',
				'android-chrome-512x512.png',
			],
			manifest: {
				name: '쉐어드레스', // 앱 전체 이름
				short_name: '쉐어드레스', // 앱 짧은 이름
				description: 'share + dress, share + address', // 앱 설명
				theme_color: '#242424', // 앱 테마 색상(상단바 등)
				background_color: '#ffffff', // 앱 배경색
				display: 'standalone', // 앱처럼 보이게(상태바 등은 보임)
				orientation: 'portrait-primary', // 세로모드 고정
				start_url: '/', // 앱 시작 경로
				scope: '/', // PWA 적용 범위
				icons: [
					{
						src: '/android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable', // 마스커블 아이콘 지원
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
				clientsClaim: true, // 새 서비스워커가 즉시 모든 탭을 제어
				skipWaiting: true, // 새 서비스워커가 대기 없이 즉시 활성화
				globPatterns: ['**/*.{js,css,html,woff2,png,jpg,svg,mp4}'], // precache할 파일 확장자
				// 필요하다면 runtimeCaching 등 추가 가능 => API 생성 후 추가 권장
			},
		}),

		// 타입스크립트/ESLint 실시간 체크 플러그인
		checker({
			typescript: true, // 타입스크립트 타입 체크
			eslint: {
				lintCommand: 'eslint "./src/**/*.{ts,tsx}"', // ESLint 검사 명령어
				dev: { logLevel: ['error', 'warning'] }, // 에러/경고만 표시
			},
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
		proxy: {
			'/api': {
				// 프론트에서 /api로 시작하는 요청을 아래 설정대로 프록시
				target: 'http://localhost:8080', // 실제 백엔드 서버 주소
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
});
