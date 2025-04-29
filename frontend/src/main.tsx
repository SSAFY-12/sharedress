// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import { RouterProvider } from 'react-router-dom';
// import { router } from '@/routes';

import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
	// <StrictMode>
	<App />,
	// </StrictMode>,
);

// const root = createRoot(document.getElementById('root')!);
// root.render(<RouterProvider router={router} />);
