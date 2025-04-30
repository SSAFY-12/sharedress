// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from '@/routes';
// import * as Sentry from '@sentry/react';
// import { useEffect } from 'react';
import './index.css';
import {
	RouterProvider,
	// 	useLocation,
	// 	useNavigationType,
} from 'react-router-dom';
// import { createRoutesFromChildren, matchRoutes } from 'react-router';

// 개발 환경에서 Sentry 초기화
// if (import.meta.env.DEV) {
// 	console.log('개발 환경에서 Sentry 초기화 중...');
// 	Sentry.init({
// 		dsn: import.meta.env.VITE_SENTRY_DSN,
// 		environment: 'development',
// 		integrations: [
// 			Sentry.reactRouterV6BrowserTracingIntegration({
// 				useEffect: useEffect,
// 				useLocation,
// 				useNavigationType,
// 				createRoutesFromChildren,
// 				matchRoutes,
// 			}),
// 			Sentry.replayIntegration(),
// 		],
// 		tracesSampleRate: 1.0,
// 		tracePropagationTargets: ['localhost'],
// 		replaysSessionSampleRate: 1.0,
// 		replaysOnErrorSampleRate: 1.0,
// 		debug: true,
// 		enabled: true,
// 		beforeSend: (event) => {
// 			console.log('Sentry 이벤트 전송 시도:', event);
// 			return event;
// 		},
// 	});
// }

createRoot(document.getElementById('root')!).render(
	// <StrictMode>
	<RouterProvider router={router} />,
	// </StrictMode>,
);

// const root = createRoot(document.getElementById('root')!);
// root.render(<RouterProvider router={router} />);
