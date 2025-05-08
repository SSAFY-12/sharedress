import RegistHomePage from '@/features/regist/pages/RegistHomePage';
import RegistScanPage from '@/features/regist/pages/RegistScanPage';
import { Route, Routes } from 'react-router-dom';
import RegistSearchPage from '@/features/regist/pages/RegistSearchPage';
import RegistCameraPage from '@/features/regist/pages/RegistCameraPage';
import RegistTestPage from '@/features/regist/pages/RegistTestPage';
const RegistPage = () => (
	<Routes>
		<Route path='/' element={<RegistHomePage />} />
		<Route path='scan' element={<RegistScanPage />} />
		<Route path='search' element={<RegistSearchPage />} />
		<Route path='camera' element={<RegistCameraPage />} />
		<Route path='test' element={<RegistTestPage />} />
	</Routes>
);

export default RegistPage;
