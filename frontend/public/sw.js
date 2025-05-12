/**
 * PWA Service Worker
 * 이 파일은 PWA의 캐싱과 오프라인 기능을 처리합니다.
 */

// 서비스 워커 설치 시 즉시 활성화
self.addEventListener('install', (event) => {
	self.skipWaiting();
});

// 서비스 워커 활성화 시 클라이언트 제어 시작
self.addEventListener('activate', (event) => {
	event.waitUntil(clients.claim());
});

// 네트워크 요청 처리
self.addEventListener('fetch', (event) => {
	// OAuth 콜백이나 인증 관련 요청은 완전히 무시
	if (
		event.request.url.includes('/oauth/') ||
		event.request.url.includes('access_token') ||
		event.request.url.includes('auth')
	) {
		return;
	}

	// 다른 요청은 네트워크로 전달
	event.respondWith(
		fetch(event.request)
			.then((response) => response)
			.catch(() => {
				// 네트워크 요청 실패 시 기본 응답 반환
				return new Response('Network error', {
					status: 503,
					statusText: 'Service Unavailable',
					headers: new Headers({
						'Content-Type': 'text/plain',
					}),
				});
			}),
	);
});
