import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// import { trackPageView, trackEvent, trackClick } from '@/utils/analytics';
import { trackPageView, trackEvent } from '@/utils/analytics';

export const GoogleAnalytics = () => {
	const location = useLocation();

	useEffect(() => {
		// 페이지 변경 시 자동으로 페이지 뷰 추적
		trackPageView(location.pathname, document.title);

		// 예시: 페이지 로드 시간 추적
		const pageLoadTime = performance.now();
		trackEvent('page_load_time', {
			time: pageLoadTime,
			path: location.pathname,
		});
	}, [location]);

	// 예시: 버튼 클릭 이벤트 핸들러
	// const handleButtonClick = (buttonName: string) => {
	// 	trackClick(buttonName);
	// };

	return null;
};
