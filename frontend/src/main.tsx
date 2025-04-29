// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';

import './index.css';

createRoot(document.getElementById('root')!).render(
	// <StrictMode>
	<RouterProvider router={router} />,
	// </StrictMode>,
);

// const root = createRoot(document.getElementById('root')!);
// root.render(<RouterProvider router={router} />);
