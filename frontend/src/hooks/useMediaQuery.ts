import { useState, useEffect } from 'react';

// [useMediaQuery 훅]
// - 주어진 미디어 쿼리(query)에 따라 true/false를 반환
// - 반응형 UI(웹/모바일 분기 등)에 활용
export const useMediaQuery = (query: string): boolean => {
	// [matches] - 쿼리 조건에 부합하면 true, 아니면 false
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		// [media] - window.matchMedia로 미디어 쿼리 객체 생성
		const media = window.matchMedia(query);
		// 현재 matches 상태와 실제 쿼리 결과가 다르면 동기화
		if (media.matches !== matches) {
			setMatches(media.matches);
		}
		// [listener] - 미디어 쿼리 변화 감지(화면 크기 등 변경 시)
		const listener = () => setMatches(media.matches);
		media.addEventListener('change', listener);
		// 언마운트 시 이벤트 해제(메모리 누수 방지)
		return () => media.removeEventListener('change', listener);
	}, [matches, query]);

	// [반환값] - 쿼리 조건에 부합하면 true, 아니면 false
	return matches;
};
