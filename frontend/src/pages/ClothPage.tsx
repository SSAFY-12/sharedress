import ClothDetailPage from '@/features/closet/pages/ClothDetailPage';
import ClothEditPage from '@/features/closet/pages/ClothEditPage';
import { Route } from 'react-router-dom';

import { Routes } from 'react-router-dom';

const ClothPage = () => (
	<Routes>
		<Route path=':id' element={<ClothDetailPage />} />
		<Route path=':id/edit' element={<ClothEditPage />} />
	</Routes>
);

export default ClothPage;
