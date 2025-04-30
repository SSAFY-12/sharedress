import { useEffect, useState } from 'react';

export const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState(false); //모바일인지 여부

	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth < 640); // sm breakpoint === 즉 640px 이하인 경우 모바일
		};

		checkIsMobile(); // 초기 렌더링 시 모바일 여부 확인
		window.addEventListener('resize', checkIsMobile); // 브라우저 크기 변경 시 모바일 여부 확인

		return () => window.removeEventListener('resize', checkIsMobile); // 컴포넌트 언마운트 시 이벤트 리스너 제거
	}, []);

	return isMobile;
};
