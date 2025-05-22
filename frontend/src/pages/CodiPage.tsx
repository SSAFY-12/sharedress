import CodiDetailPage from '@/features/closet/pages/CodiDetailPage';
import CodiEditPage from '@/features/codi/pages/CodiEditPage';
import CodiSavePage from '@/features/codi/pages/CodiSavePage';
import { Routes } from 'react-router-dom';

import { Route } from 'react-router-dom';

const CodiPage = () => (
	<Routes>
		<Route path=':id' element={<CodiDetailPage />} />
		<Route path='edit' element={<CodiEditPage />} />
		<Route path='save' element={<CodiSavePage />} />
	</Routes>
);

export default CodiPage;
