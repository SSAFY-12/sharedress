import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

export const GoogleAnalytics = () => {
	const location = useLocation();

	useEffect(() => {
		// 페이지 변경 시 자동으로 페이지 뷰 추적
		trackPageView(location.pathname, document.title);
	}, [location]);

	return null;
};
