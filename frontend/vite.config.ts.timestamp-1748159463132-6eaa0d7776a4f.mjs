// vite.config.ts
import { sentryVitePlugin } from "file:///C:/Users/user/Desktop/yeseung/S12P31A705/frontend/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
import { defineConfig, loadEnv } from "file:///C:/Users/user/Desktop/yeseung/S12P31A705/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/user/Desktop/yeseung/S12P31A705/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import checker from "file:///C:/Users/user/Desktop/yeseung/S12P31A705/frontend/node_modules/vite-plugin-checker/dist/main.js";
import tailwindcss from "file:///C:/Users/user/Desktop/yeseung/S12P31A705/frontend/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///C:/Users/user/Desktop/yeseung/S12P31A705/frontend/node_modules/autoprefixer/lib/autoprefixer.js";
import path from "path";
import mkcert from "file:///C:/Users/user/Desktop/yeseung/S12P31A705/frontend/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
import { VitePWA } from "file:///C:/Users/user/Desktop/yeseung/S12P31A705/frontend/node_modules/vite-plugin-pwa/dist/index.js";
import fs from "fs";
import viteImagemin from "file:///C:/Users/user/Desktop/yeseung/S12P31A705/frontend/node_modules/vite-plugin-imagemin/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\user\\Desktop\\yeseung\\S12P31A705\\frontend";
var cspHeader = [
  // 기본 설정
  "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: data:",
  // FCM 푸시 알림 기본 설정
  // 스크립트 설정
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:",
  // FCM 푸시 알림 스크립트 설정
  // 스타일 설정
  "style-src 'self' 'unsafe-inline' https: http:",
  // FCM 푸시 알림 스타일 설정
  // 이미지 설정
  "img-src 'self' data: blob: https: http:",
  // FCM 푸시 알림 이미지 설정
  // 폰트 설정
  "font-src 'self' data: https: http:",
  // FCM 푸시 알림 폰트 설정
  // 프레임 설정
  "frame-src 'self' https: http:",
  // FCM 푸시 알림 프레임 설정
  // 웹소켓 등 연결 설정 (Vite HMR을 위해 필요)
  "connect-src 'self' ws: wss: https: http:",
  // FCM 푸시 알림 웹소켓 설정
  // 워커 설정 (PWA를 위해 필요)
  "worker-src 'self' blob:",
  // FCM 푸시 알림 워커 설정
  // 매니페스트 설정
  "manifest-src 'self'"
  // FCM 푸시 알림 매니페스트 설정
].join("; ");
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDevelopment = mode === "development";
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
			// console.log('\uBC31\uADF8\uB77C\uC6B4\uB4DC \uBA54\uC2DC\uC9C0 \uC218\uC2E0:', payload);

			const notificationTitle = payload.notification.title;
			const notificationOptions = {
				body: payload.notification.body,
				icon: '/new-android-chrome-192x192.png',
				badge: '/new-favicon-32x32.png',
				data: payload.data,
			};

			self.registration.showNotification(notificationTitle, notificationOptions);
		});

		self.addEventListener('notificationclick', (event) => {
			event.notification.close();

			// \uC54C\uB9BC \uD074\uB9AD \uC2DC \uC6F9\uC0AC\uC774\uD2B8\uB85C \uC774\uB3D9
			event.waitUntil(
				clients.matchAll({ type: 'window' }).then((clientList) => {
					// \uC774\uBBF8 \uC5F4\uB824\uC788\uB294 \uCC3D\uC774 \uC788\uB2E4\uBA74 \uADF8 \uCC3D\uC73C\uB85C \uC774\uB3D9
					for (const client of clientList) {
						if (client.url.includes('/') && 'focus' in client) {
							return client.focus();
						}
					}
					// \uC5F4\uB824\uC788\uB294 \uCC3D\uC774 \uC5C6\uB2E4\uBA74 \uC0C8 \uCC3D \uC5F4\uAE30
					if (clients.openWindow) {
						return clients.openWindow('/');
					}
				}),
			);
		});
	`;
  if (mode === "production") {
    fs.writeFileSync(
      path.resolve(__vite_injected_original_dirname, "public/firebase-messaging-sw.js"),
      swContent
    );
  }
  return {
    plugins: [
      react(),
      mkcert(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: false,
        devOptions: { enabled: true, type: "module" },
        includeAssets: [
          "new-favicon.ico",
          "new-apple-touch-icon.png",
          "new-favicon-16x16.png",
          "new-favicon-32x32.png",
          "new-android-chrome-192x192.png",
          "new-android-chrome-512x512.png"
        ],
        manifest: {
          name: "\uC250\uC5B4\uB4DC\uB808\uC2A4",
          short_name: "\uC250\uC5B4\uB4DC\uB808\uC2A4",
          description: "share + dress, share + address",
          theme_color: "#242424",
          background_color: "#ffffff",
          display: "standalone",
          orientation: "portrait-primary",
          start_url: "/",
          scope: "/",
          icons: [
            {
              src: "/new-android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any maskable"
            },
            {
              src: "/new-android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable"
            }
          ]
        },
        workbox: {
          disableDevLogs: true,
          clientsClaim: true,
          skipWaiting: true,
          globPatterns: ["**/*.{js,css,html,woff2,png,jpg,svg,mp4}"],
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          // 10MB로 증가
          runtimeCaching: [
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "images",
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 30 * 24 * 60 * 60
                }
              }
            }
          ]
        }
      }),
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
          dev: { logLevel: ["error", "warning"] }
        }
      }),
      sentryVitePlugin({
        org: "sharedress",
        project: "javascript-react"
      }),
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false
        },
        optipng: {
          optimizationLevel: 7
        },
        mozjpeg: {
          quality: 40
          // 품질을 40%로 더 낮춤
        },
        pngquant: {
          quality: [0.4, 0.6],
          // 품질 범위를 더 낮춤
          speed: 4
        },
        svgo: {
          plugins: [
            {
              name: "removeViewBox"
            },
            {
              name: "removeEmptyAttrs",
              active: false
            }
          ]
        }
      })
    ],
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer]
      }
    },
    resolve: {
      alias: { "@": path.resolve(__vite_injected_original_dirname, "./src") }
    },
    server: {
      https: true,
      port: 5173,
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
        "Cross-Origin-Embedder-Policy": "credentialless",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Access-Control-Allow-Origin": "*",
        "Cross-Origin-Resource-Policy": "cross-origin",
        "Content-Security-Policy": cspHeader
      },
      proxy: {
        "/api": {
          target: "http://www.sharedress.co.kr",
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        input: {
          main: path.resolve(__vite_injected_original_dirname, "index.html"),
          "service-worker": path.resolve(
            __vite_injected_original_dirname,
            "public/firebase-messaging-sw.js"
          )
        },
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
                return "vendor-react";
              }
              if (id.includes("framer-motion") || id.includes("react-toastify") || id.includes("lucide-react")) {
                return "vendor-ui";
              }
              if (id.includes("date-fns") || id.includes("jwt-decode")) {
                return "vendor-utils";
              }
              return "vendor";
            }
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name;
            if (!info)
              return "assets/[name]-[hash][extname]";
            if (info.endsWith(".png") || info.endsWith(".jpg")) {
              return "assets/images/[name]-[hash][extname]";
            }
            return "assets/[name]-[hash][extname]";
          }
        }
      },
      outDir: "dist",
      assetsDir: "assets",
      base: "/",
      chunkSizeWarningLimit: 2e3,
      assetsInlineLimit: 4096
    },
    define: {
      "process.env": process.env
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx1c2VyXFxcXERlc2t0b3BcXFxceWVzZXVuZ1xcXFxTMTJQMzFBNzA1XFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx1c2VyXFxcXERlc2t0b3BcXFxceWVzZXVuZ1xcXFxTMTJQMzFBNzA1XFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy91c2VyL0Rlc2t0b3AveWVzZXVuZy9TMTJQMzFBNzA1L2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgc2VudHJ5Vml0ZVBsdWdpbiB9IGZyb20gJ0BzZW50cnkvdml0ZS1wbHVnaW4nO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IGNoZWNrZXIgZnJvbSAndml0ZS1wbHVnaW4tY2hlY2tlcic7XHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICd0YWlsd2luZGNzcyc7XHJcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCBta2NlcnQgZnJvbSAndml0ZS1wbHVnaW4tbWtjZXJ0JztcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCB2aXRlSW1hZ2VtaW4gZnJvbSAndml0ZS1wbHVnaW4taW1hZ2VtaW4nO1xyXG5cclxuY29uc3QgY3NwSGVhZGVyID0gW1xyXG5cdC8vIFx1QUUzMFx1QkNGOCBcdUMxMjRcdUM4MTVcclxuXHRcImRlZmF1bHQtc3JjICdzZWxmJyAndW5zYWZlLWlubGluZScgJ3Vuc2FmZS1ldmFsJyBodHRwczogaHR0cDogZGF0YTpcIiwgLy8gRkNNIFx1RDQ3OFx1QzJEQyBcdUM1NENcdUI5QkMgXHVBRTMwXHVCQ0Y4IFx1QzEyNFx1QzgxNVxyXG5cclxuXHQvLyBcdUMyQTRcdUQwNkNcdUI5QkRcdUQyQjggXHVDMTI0XHVDODE1XHJcblx0XCJzY3JpcHQtc3JjICdzZWxmJyAndW5zYWZlLWlubGluZScgJ3Vuc2FmZS1ldmFsJyBodHRwczogaHR0cDpcIiwgLy8gRkNNIFx1RDQ3OFx1QzJEQyBcdUM1NENcdUI5QkMgXHVDMkE0XHVEMDZDXHVCOUJEXHVEMkI4IFx1QzEyNFx1QzgxNVxyXG5cclxuXHQvLyBcdUMyQTRcdUQwQzBcdUM3N0MgXHVDMTI0XHVDODE1XHJcblx0XCJzdHlsZS1zcmMgJ3NlbGYnICd1bnNhZmUtaW5saW5lJyBodHRwczogaHR0cDpcIiwgLy8gRkNNIFx1RDQ3OFx1QzJEQyBcdUM1NENcdUI5QkMgXHVDMkE0XHVEMEMwXHVDNzdDIFx1QzEyNFx1QzgxNVxyXG5cclxuXHQvLyBcdUM3NzRcdUJCRjhcdUM5QzAgXHVDMTI0XHVDODE1XHJcblx0XCJpbWctc3JjICdzZWxmJyBkYXRhOiBibG9iOiBodHRwczogaHR0cDpcIiwgLy8gRkNNIFx1RDQ3OFx1QzJEQyBcdUM1NENcdUI5QkMgXHVDNzc0XHVCQkY4XHVDOUMwIFx1QzEyNFx1QzgxNVxyXG5cclxuXHQvLyBcdUQzRjBcdUQyQjggXHVDMTI0XHVDODE1XHJcblx0XCJmb250LXNyYyAnc2VsZicgZGF0YTogaHR0cHM6IGh0dHA6XCIsIC8vIEZDTSBcdUQ0NzhcdUMyREMgXHVDNTRDXHVCOUJDIFx1RDNGMFx1RDJCOCBcdUMxMjRcdUM4MTVcclxuXHJcblx0Ly8gXHVENTA0XHVCODA4XHVDNzg0IFx1QzEyNFx1QzgxNVxyXG5cdFwiZnJhbWUtc3JjICdzZWxmJyBodHRwczogaHR0cDpcIiwgLy8gRkNNIFx1RDQ3OFx1QzJEQyBcdUM1NENcdUI5QkMgXHVENTA0XHVCODA4XHVDNzg0IFx1QzEyNFx1QzgxNVxyXG5cclxuXHQvLyBcdUM2RjlcdUMxOENcdUNGMTMgXHVCNEYxIFx1QzVGMFx1QUNCMCBcdUMxMjRcdUM4MTUgKFZpdGUgSE1SXHVDNzQ0IFx1QzcwNFx1RDU3NCBcdUQ1NDRcdUM2OTQpXHJcblx0XCJjb25uZWN0LXNyYyAnc2VsZicgd3M6IHdzczogaHR0cHM6IGh0dHA6XCIsIC8vIEZDTSBcdUQ0NzhcdUMyREMgXHVDNTRDXHVCOUJDIFx1QzZGOVx1QzE4Q1x1Q0YxMyBcdUMxMjRcdUM4MTVcclxuXHJcblx0Ly8gXHVDNkNDXHVDRUU0IFx1QzEyNFx1QzgxNSAoUFdBXHVCOTdDIFx1QzcwNFx1RDU3NCBcdUQ1NDRcdUM2OTQpXHJcblx0XCJ3b3JrZXItc3JjICdzZWxmJyBibG9iOlwiLCAvLyBGQ00gXHVENDc4XHVDMkRDIFx1QzU0Q1x1QjlCQyBcdUM2Q0NcdUNFRTQgXHVDMTI0XHVDODE1XHJcblxyXG5cdC8vIFx1QjlFNFx1QjJDOFx1RDM5OFx1QzJBNFx1RDJCOCBcdUMxMjRcdUM4MTVcclxuXHRcIm1hbmlmZXN0LXNyYyAnc2VsZidcIiwgLy8gRkNNIFx1RDQ3OFx1QzJEQyBcdUM1NENcdUI5QkMgXHVCOUU0XHVCMkM4XHVEMzk4XHVDMkE0XHVEMkI4IFx1QzEyNFx1QzgxNVxyXG5dLmpvaW4oJzsgJyk7XHJcblxyXG4vLyBWaXRlIFx1QzEyNFx1QzgxNSBcdUQzMENcdUM3N0NcclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG5cdGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xyXG5cdGNvbnN0IGlzRGV2ZWxvcG1lbnQgPSBtb2RlID09PSAnZGV2ZWxvcG1lbnQnO1xyXG5cclxuXHQvLyBTZXJ2aWNlIFdvcmtlciBcdUQzMENcdUM3N0MgXHVDMEREXHVDMTMxXHJcblx0Y29uc3Qgc3dDb250ZW50ID0gYFxyXG5cdFx0aW1wb3J0U2NyaXB0cyhcclxuXHRcdFx0J2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4wLjAvZmlyZWJhc2UtYXBwLWNvbXBhdC5qcycsXHJcblx0XHQpO1xyXG5cdFx0aW1wb3J0U2NyaXB0cyhcclxuXHRcdFx0J2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4wLjAvZmlyZWJhc2UtbWVzc2FnaW5nLWNvbXBhdC5qcycsXHJcblx0XHQpO1xyXG5cclxuXHRcdGZpcmViYXNlLmluaXRpYWxpemVBcHAoe1xyXG5cdFx0XHRhcGlLZXk6ICcke2Vudi5WSVRFX0ZJUkVCQVNFX0FQSV9LRVl9JyxcclxuXHRcdFx0YXV0aERvbWFpbjogJyR7ZW52LlZJVEVfRklSRUJBU0VfQVVUSF9ET01BSU59JyxcclxuXHRcdFx0cHJvamVjdElkOiAnJHtlbnYuVklURV9GSVJFQkFTRV9QUk9KRUNUX0lEfScsXHJcblx0XHRcdHN0b3JhZ2VCdWNrZXQ6ICcke2Vudi5WSVRFX0ZJUkVCQVNFX1NUT1JBR0VfQlVDS0VUfScsXHJcblx0XHRcdG1lc3NhZ2luZ1NlbmRlcklkOiAnJHtlbnYuVklURV9GSVJFQkFTRV9NRVNTQUdJTkdfU0VOREVSX0lEfScsXHJcblx0XHRcdGFwcElkOiAnJHtlbnYuVklURV9GSVJFQkFTRV9BUFBfSUR9JyxcclxuXHRcdH0pO1xyXG5cclxuXHRcdGNvbnN0IG1lc3NhZ2luZyA9IGZpcmViYXNlLm1lc3NhZ2luZygpO1xyXG5cclxuXHRcdG1lc3NhZ2luZy5vbkJhY2tncm91bmRNZXNzYWdlKChwYXlsb2FkKSA9PiB7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdcdUJDMzFcdUFERjhcdUI3N0NcdUM2QjRcdUI0REMgXHVCQTU0XHVDMkRDXHVDOUMwIFx1QzIxOFx1QzJFMDonLCBwYXlsb2FkKTtcclxuXHJcblx0XHRcdGNvbnN0IG5vdGlmaWNhdGlvblRpdGxlID0gcGF5bG9hZC5ub3RpZmljYXRpb24udGl0bGU7XHJcblx0XHRcdGNvbnN0IG5vdGlmaWNhdGlvbk9wdGlvbnMgPSB7XHJcblx0XHRcdFx0Ym9keTogcGF5bG9hZC5ub3RpZmljYXRpb24uYm9keSxcclxuXHRcdFx0XHRpY29uOiAnL25ldy1hbmRyb2lkLWNocm9tZS0xOTJ4MTkyLnBuZycsXHJcblx0XHRcdFx0YmFkZ2U6ICcvbmV3LWZhdmljb24tMzJ4MzIucG5nJyxcclxuXHRcdFx0XHRkYXRhOiBwYXlsb2FkLmRhdGEsXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRzZWxmLnJlZ2lzdHJhdGlvbi5zaG93Tm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvblRpdGxlLCBub3RpZmljYXRpb25PcHRpb25zKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbm90aWZpY2F0aW9uY2xpY2snLCAoZXZlbnQpID0+IHtcclxuXHRcdFx0ZXZlbnQubm90aWZpY2F0aW9uLmNsb3NlKCk7XHJcblxyXG5cdFx0XHQvLyBcdUM1NENcdUI5QkMgXHVEMDc0XHVCOUFEIFx1QzJEQyBcdUM2RjlcdUMwQUNcdUM3NzRcdUQyQjhcdUI4NUMgXHVDNzc0XHVCM0Q5XHJcblx0XHRcdGV2ZW50LndhaXRVbnRpbChcclxuXHRcdFx0XHRjbGllbnRzLm1hdGNoQWxsKHsgdHlwZTogJ3dpbmRvdycgfSkudGhlbigoY2xpZW50TGlzdCkgPT4ge1xyXG5cdFx0XHRcdFx0Ly8gXHVDNzc0XHVCQkY4IFx1QzVGNFx1QjgyNFx1Qzc4OFx1QjI5NCBcdUNDM0RcdUM3NzQgXHVDNzg4XHVCMkU0XHVCQTc0IFx1QURGOCBcdUNDM0RcdUM3M0NcdUI4NUMgXHVDNzc0XHVCM0Q5XHJcblx0XHRcdFx0XHRmb3IgKGNvbnN0IGNsaWVudCBvZiBjbGllbnRMaXN0KSB7XHJcblx0XHRcdFx0XHRcdGlmIChjbGllbnQudXJsLmluY2x1ZGVzKCcvJykgJiYgJ2ZvY3VzJyBpbiBjbGllbnQpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gY2xpZW50LmZvY3VzKCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIFx1QzVGNFx1QjgyNFx1Qzc4OFx1QjI5NCBcdUNDM0RcdUM3NzQgXHVDNUM2XHVCMkU0XHVCQTc0IFx1QzBDOCBcdUNDM0QgXHVDNUY0XHVBRTMwXHJcblx0XHRcdFx0XHRpZiAoY2xpZW50cy5vcGVuV2luZG93KSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBjbGllbnRzLm9wZW5XaW5kb3coJy8nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KSxcclxuXHRcdFx0KTtcclxuXHRcdH0pO1xyXG5cdGA7XHJcblxyXG5cdC8vIFx1QkU0Q1x1QjREQyBcdUMyRENcdUM4MTBcdUM1RDAgU2VydmljZSBXb3JrZXIgXHVEMzBDXHVDNzdDIFx1QzBERFx1QzEzMVxyXG5cdGlmIChtb2RlID09PSAncHJvZHVjdGlvbicpIHtcclxuXHRcdGZzLndyaXRlRmlsZVN5bmMoXHJcblx0XHRcdHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdwdWJsaWMvZmlyZWJhc2UtbWVzc2FnaW5nLXN3LmpzJyksXHJcblx0XHRcdHN3Q29udGVudCxcclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0cGx1Z2luczogW1xyXG5cdFx0XHRyZWFjdCgpLFxyXG5cdFx0XHRta2NlcnQoKSxcclxuXHRcdFx0Vml0ZVBXQSh7XHJcblx0XHRcdFx0cmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXHJcblx0XHRcdFx0aW5qZWN0UmVnaXN0ZXI6IGZhbHNlLFxyXG5cdFx0XHRcdGRldk9wdGlvbnM6IHsgZW5hYmxlZDogdHJ1ZSwgdHlwZTogJ21vZHVsZScgfSxcclxuXHRcdFx0XHRpbmNsdWRlQXNzZXRzOiBbXHJcblx0XHRcdFx0XHQnbmV3LWZhdmljb24uaWNvJyxcclxuXHRcdFx0XHRcdCduZXctYXBwbGUtdG91Y2gtaWNvbi5wbmcnLFxyXG5cdFx0XHRcdFx0J25ldy1mYXZpY29uLTE2eDE2LnBuZycsXHJcblx0XHRcdFx0XHQnbmV3LWZhdmljb24tMzJ4MzIucG5nJyxcclxuXHRcdFx0XHRcdCduZXctYW5kcm9pZC1jaHJvbWUtMTkyeDE5Mi5wbmcnLFxyXG5cdFx0XHRcdFx0J25ldy1hbmRyb2lkLWNocm9tZS01MTJ4NTEyLnBuZycsXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRtYW5pZmVzdDoge1xyXG5cdFx0XHRcdFx0bmFtZTogJ1x1QzI1MFx1QzVCNFx1QjREQ1x1QjgwOFx1QzJBNCcsXHJcblx0XHRcdFx0XHRzaG9ydF9uYW1lOiAnXHVDMjUwXHVDNUI0XHVCNERDXHVCODA4XHVDMkE0JyxcclxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiAnc2hhcmUgKyBkcmVzcywgc2hhcmUgKyBhZGRyZXNzJyxcclxuXHRcdFx0XHRcdHRoZW1lX2NvbG9yOiAnIzI0MjQyNCcsXHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kX2NvbG9yOiAnI2ZmZmZmZicsXHJcblx0XHRcdFx0XHRkaXNwbGF5OiAnc3RhbmRhbG9uZScsXHJcblx0XHRcdFx0XHRvcmllbnRhdGlvbjogJ3BvcnRyYWl0LXByaW1hcnknLFxyXG5cdFx0XHRcdFx0c3RhcnRfdXJsOiAnLycsXHJcblx0XHRcdFx0XHRzY29wZTogJy8nLFxyXG5cdFx0XHRcdFx0aWNvbnM6IFtcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdHNyYzogJy9uZXctYW5kcm9pZC1jaHJvbWUtMTkyeDE5Mi5wbmcnLFxyXG5cdFx0XHRcdFx0XHRcdHNpemVzOiAnMTkyeDE5MicsXHJcblx0XHRcdFx0XHRcdFx0dHlwZTogJ2ltYWdlL3BuZycsXHJcblx0XHRcdFx0XHRcdFx0cHVycG9zZTogJ2FueSBtYXNrYWJsZScsXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRzcmM6ICcvbmV3LWFuZHJvaWQtY2hyb21lLTUxMng1MTIucG5nJyxcclxuXHRcdFx0XHRcdFx0XHRzaXplczogJzUxMng1MTInLFxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6ICdpbWFnZS9wbmcnLFxyXG5cdFx0XHRcdFx0XHRcdHB1cnBvc2U6ICdhbnkgbWFza2FibGUnLFxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHdvcmtib3g6IHtcclxuXHRcdFx0XHRcdGRpc2FibGVEZXZMb2dzOiB0cnVlLFxyXG5cdFx0XHRcdFx0Y2xpZW50c0NsYWltOiB0cnVlLFxyXG5cdFx0XHRcdFx0c2tpcFdhaXRpbmc6IHRydWUsXHJcblx0XHRcdFx0XHRnbG9iUGF0dGVybnM6IFsnKiovKi57anMsY3NzLGh0bWwsd29mZjIscG5nLGpwZyxzdmcsbXA0fSddLFxyXG5cdFx0XHRcdFx0bWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDEwICogMTAyNCAqIDEwMjQsIC8vIDEwTUJcdUI4NUMgXHVDOTlEXHVBQzAwXHJcblx0XHRcdFx0XHRydW50aW1lQ2FjaGluZzogW1xyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0dXJsUGF0dGVybjogL1xcLig/OnBuZ3xqcGd8anBlZ3xzdmd8Z2lmKSQvLFxyXG5cdFx0XHRcdFx0XHRcdGhhbmRsZXI6ICdDYWNoZUZpcnN0JyxcclxuXHRcdFx0XHRcdFx0XHRvcHRpb25zOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRjYWNoZU5hbWU6ICdpbWFnZXMnLFxyXG5cdFx0XHRcdFx0XHRcdFx0ZXhwaXJhdGlvbjoge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRtYXhFbnRyaWVzOiA2MCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWF4QWdlU2Vjb25kczogMzAgKiAyNCAqIDYwICogNjAsXHJcblx0XHRcdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0pLFxyXG5cdFx0XHRjaGVja2VyKHtcclxuXHRcdFx0XHR0eXBlc2NyaXB0OiB0cnVlLFxyXG5cdFx0XHRcdGVzbGludDoge1xyXG5cdFx0XHRcdFx0bGludENvbW1hbmQ6ICdlc2xpbnQgXCIuL3NyYy8qKi8qLnt0cyx0c3h9XCInLFxyXG5cdFx0XHRcdFx0ZGV2OiB7IGxvZ0xldmVsOiBbJ2Vycm9yJywgJ3dhcm5pbmcnXSB9LFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0pLFxyXG5cdFx0XHRzZW50cnlWaXRlUGx1Z2luKHtcclxuXHRcdFx0XHRvcmc6ICdzaGFyZWRyZXNzJyxcclxuXHRcdFx0XHRwcm9qZWN0OiAnamF2YXNjcmlwdC1yZWFjdCcsXHJcblx0XHRcdH0pLFxyXG5cdFx0XHR2aXRlSW1hZ2VtaW4oe1xyXG5cdFx0XHRcdGdpZnNpY2xlOiB7XHJcblx0XHRcdFx0XHRvcHRpbWl6YXRpb25MZXZlbDogNyxcclxuXHRcdFx0XHRcdGludGVybGFjZWQ6IGZhbHNlLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0b3B0aXBuZzoge1xyXG5cdFx0XHRcdFx0b3B0aW1pemF0aW9uTGV2ZWw6IDcsXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRtb3pqcGVnOiB7XHJcblx0XHRcdFx0XHRxdWFsaXR5OiA0MCwgLy8gXHVENDg4XHVDOUM4XHVDNzQ0IDQwJVx1Qjg1QyBcdUIzNTQgXHVCMEFFXHVDREE0XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRwbmdxdWFudDoge1xyXG5cdFx0XHRcdFx0cXVhbGl0eTogWzAuNCwgMC42XSwgLy8gXHVENDg4XHVDOUM4IFx1QkM5NFx1QzcwNFx1Qjk3QyBcdUIzNTQgXHVCMEFFXHVDREE0XHJcblx0XHRcdFx0XHRzcGVlZDogNCxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHN2Z286IHtcclxuXHRcdFx0XHRcdHBsdWdpbnM6IFtcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdG5hbWU6ICdyZW1vdmVWaWV3Qm94JyxcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdG5hbWU6ICdyZW1vdmVFbXB0eUF0dHJzJyxcclxuXHRcdFx0XHRcdFx0XHRhY3RpdmU6IGZhbHNlLFxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9KSxcclxuXHRcdF0sXHJcblx0XHRjc3M6IHtcclxuXHRcdFx0cG9zdGNzczoge1xyXG5cdFx0XHRcdHBsdWdpbnM6IFt0YWlsd2luZGNzcywgYXV0b3ByZWZpeGVyXSxcclxuXHRcdFx0fSxcclxuXHRcdH0sXHJcblx0XHRyZXNvbHZlOiB7XHJcblx0XHRcdGFsaWFzOiB7ICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJykgfSxcclxuXHRcdH0sXHJcblx0XHRzZXJ2ZXI6IHtcclxuXHRcdFx0aHR0cHM6IHRydWUsXHJcblx0XHRcdHBvcnQ6IDUxNzMsXHJcblx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHQnQ3Jvc3MtT3JpZ2luLU9wZW5lci1Qb2xpY3knOiAnc2FtZS1vcmlnaW4tYWxsb3ctcG9wdXBzJyxcclxuXHRcdFx0XHQnQ3Jvc3MtT3JpZ2luLUVtYmVkZGVyLVBvbGljeSc6ICdjcmVkZW50aWFsbGVzcycsXHJcblx0XHRcdFx0J1JlZmVycmVyLVBvbGljeSc6ICdzdHJpY3Qtb3JpZ2luLXdoZW4tY3Jvc3Mtb3JpZ2luJyxcclxuXHRcdFx0XHQnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxyXG5cdFx0XHRcdCdDcm9zcy1PcmlnaW4tUmVzb3VyY2UtUG9saWN5JzogJ2Nyb3NzLW9yaWdpbicsXHJcblx0XHRcdFx0J0NvbnRlbnQtU2VjdXJpdHktUG9saWN5JzogY3NwSGVhZGVyLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRwcm94eToge1xyXG5cdFx0XHRcdCcvYXBpJzoge1xyXG5cdFx0XHRcdFx0dGFyZ2V0OiAnaHR0cDovL3d3dy5zaGFyZWRyZXNzLmNvLmtyJyxcclxuXHRcdFx0XHRcdGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuXHRcdFx0XHRcdHNlY3VyZTogZmFsc2UsXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0fSxcclxuXHRcdH0sXHJcblx0XHRidWlsZDoge1xyXG5cdFx0XHRzb3VyY2VtYXA6IHRydWUsXHJcblx0XHRcdHJvbGx1cE9wdGlvbnM6IHtcclxuXHRcdFx0XHRpbnB1dDoge1xyXG5cdFx0XHRcdFx0bWFpbjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2luZGV4Lmh0bWwnKSxcclxuXHRcdFx0XHRcdCdzZXJ2aWNlLXdvcmtlcic6IHBhdGgucmVzb2x2ZShcclxuXHRcdFx0XHRcdFx0X19kaXJuYW1lLFxyXG5cdFx0XHRcdFx0XHQncHVibGljL2ZpcmViYXNlLW1lc3NhZ2luZy1zdy5qcycsXHJcblx0XHRcdFx0XHQpLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0b3V0cHV0OiB7XHJcblx0XHRcdFx0XHRtYW51YWxDaHVua3M6IChpZCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKFxyXG5cdFx0XHRcdFx0XHRcdFx0aWQuaW5jbHVkZXMoJ3JlYWN0JykgfHxcclxuXHRcdFx0XHRcdFx0XHRcdGlkLmluY2x1ZGVzKCdyZWFjdC1kb20nKSB8fFxyXG5cdFx0XHRcdFx0XHRcdFx0aWQuaW5jbHVkZXMoJ3JlYWN0LXJvdXRlci1kb20nKVxyXG5cdFx0XHRcdFx0XHRcdCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuICd2ZW5kb3ItcmVhY3QnO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZiAoXHJcblx0XHRcdFx0XHRcdFx0XHRpZC5pbmNsdWRlcygnZnJhbWVyLW1vdGlvbicpIHx8XHJcblx0XHRcdFx0XHRcdFx0XHRpZC5pbmNsdWRlcygncmVhY3QtdG9hc3RpZnknKSB8fFxyXG5cdFx0XHRcdFx0XHRcdFx0aWQuaW5jbHVkZXMoJ2x1Y2lkZS1yZWFjdCcpXHJcblx0XHRcdFx0XHRcdFx0KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3ZlbmRvci11aSc7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmIChpZC5pbmNsdWRlcygnZGF0ZS1mbnMnKSB8fCBpZC5pbmNsdWRlcygnand0LWRlY29kZScpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3ZlbmRvci11dGlscyc7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAndmVuZG9yJztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGluZm8gPSBhc3NldEluZm8ubmFtZTtcclxuXHRcdFx0XHRcdFx0aWYgKCFpbmZvKSByZXR1cm4gJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdJztcclxuXHRcdFx0XHRcdFx0aWYgKGluZm8uZW5kc1dpdGgoJy5wbmcnKSB8fCBpbmZvLmVuZHNXaXRoKCcuanBnJykpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gJ2Fzc2V0cy9pbWFnZXMvW25hbWVdLVtoYXNoXVtleHRuYW1lXSc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0cmV0dXJuICdhc3NldHMvW25hbWVdLVtoYXNoXVtleHRuYW1lXSc7XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0sXHJcblx0XHRcdG91dERpcjogJ2Rpc3QnLFxyXG5cdFx0XHRhc3NldHNEaXI6ICdhc3NldHMnLFxyXG5cdFx0XHRiYXNlOiAnLycsXHJcblx0XHRcdGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMjAwMCxcclxuXHRcdFx0YXNzZXRzSW5saW5lTGltaXQ6IDQwOTYsXHJcblx0XHR9LFxyXG5cdFx0ZGVmaW5lOiB7XHJcblx0XHRcdCdwcm9jZXNzLmVudic6IHByb2Nlc3MuZW52LFxyXG5cdFx0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
