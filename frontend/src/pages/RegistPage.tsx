import RegistHomePage from '@/features/regist/pages/RegistHomePage';
import RegistScanPage from '@/features/regist/pages/RegistScanPage';
import { Route, Routes } from 'react-router-dom';
import RegistSearchPage from '@/features/regist/pages/RegistSearchPage';
import RegistCameraPage from '@/features/regist/pages/RegistCameraPage';
import RegistScanMusinsaPage from '@/features/regist/pages/RegistScanMusinsaPage';
import RegistCameraPrePage from '@/features/regist/pages/RegistCameraPrePage';
import RegistScan29CmPage from '@/features/regist/pages/RegistScan29CmPage';

const RegistPage = () => (
	<Routes>
		<Route path='/' element={<RegistHomePage />} />
		<Route path='scan' element={<RegistScanPage />} />
		<Route path='search' element={<RegistSearchPage />} />
		<Route path='camera' element={<RegistCameraPage />} />
		<Route path='scan/musinsa' element={<RegistScanMusinsaPage />} />
		<Route path='scan/29cm' element={<RegistScan29CmPage />} />
		<Route path='camera/pre' element={<RegistCameraPrePage />} />
	</Routes>
);

export default RegistPage;
