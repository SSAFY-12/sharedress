// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from '@/routes';
import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import './index.css';
import {
	RouterProvider,
	// 	useLocation,
	// 	useNavigationType,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { registerServiceWorker } from './utils/serviceWorker';
import useFcmStore from './store/useFcmStore';
// import { createRoutesFromChildren, matchRoutes } from 'react-router';

// Sentry 초기화
Sentry.init({
	dsn: import.meta.env.VITE_SENTRY_DSN,
	integrations: [
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration(),
	],
	tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
	tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
	debug: !import.meta.env.PROD,
	environment: import.meta.env.MODE,
	replaysSessionSampleRate: import.meta.env.PROD ? 0.01 : 1.0,
	replaysOnErrorSampleRate: 1.0,
	beforeSend: (event) => {
		if (!import.meta.env.PROD) {
			console.log('Sentry 이벤트 전송:', event);
		}
		return event;
	},
});

const queryClient = new QueryClient();

// 앱 시작 시 FCM 토큰을 IndexedDB에서 Zustand로 동기화
useEffect(() => {
	useFcmStore.getState().syncFromIndexedDb();
}, []);

registerServiceWorker();

createRoot(document.getElementById('root')!).render(
	// <StrictMode>
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />
	</QueryClientProvider>,

	// </StrictMode>
);

// const root = createRoot(document.getElementById('root')!);
// root.render(<RouterProvider router={router} />);
