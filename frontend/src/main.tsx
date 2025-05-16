// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from '@/routes';
import * as Sentry from '@sentry/react';
// import { useEffect } from 'react';
import './index.css';
import {
	RouterProvider,
	// 	useLocation,
	// 	useNavigationType,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { createRoutesFromChildren, matchRoutes } from 'react-router';

// Sentry 초기화
Sentry.init({
	dsn: import.meta.env.VITE_SENTRY_DSN,
	integrations: [
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration(),
	],
	// 성능 모니터링을 위한 설정
	tracesSampleRate: 1.0,
	tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],

	// 디버그 모드 활성화
	debug: true,

	// 환경 설정
	environment: import.meta.env.MODE,

	// Replay 설정
	replaysSessionSampleRate: 1.0,
	replaysOnErrorSampleRate: 1.0,

	// 이벤트 전송 전 로깅
	beforeSend: (event) => {
		console.log('Sentry 이벤트 전송:', event);
		return event;
	},
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
	// <StrictMode>
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />
	</QueryClientProvider>,

	// </StrictMode>
);

// const root = createRoot(document.getElementById('root')!);
// root.render(<RouterProvider router={router} />);
