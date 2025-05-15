import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
	exp: number;
	[key: string]: any;
}

// 토큰 유효성 검사
export const isTokenValid = (token: string | null): boolean => {
	if (!token) return false;

	try {
		const decoded = jwtDecode<DecodedToken>(token); // 토큰 디코딩
		const currentTime = Date.now() / 1000; // 현재 시간을 초 단위로 변환
		return decoded.exp > currentTime; // 토큰 만료 시간이 현재 시간보다 크면 유효
	} catch (error) {
		console.error('토큰 유효성 검사 에러:', error);
		return false;
	}
};

export const getTokenExpiration = (token: string): number | null => {
	// 1. 토큰 헤더 / 2. 페이로드 / 3. 서명
	// 토큰 헤더에 있는 타입 확인

	try {
		const decoded = jwtDecode<DecodedToken>(token); // 토큰 디코딩
		// exp : 만료시간 , sub : 사용자 아이디, iat : 발급시간
		return decoded.exp; // 토큰 만료 시간 반환
	} catch (error) {
		console.error('Token decoding error:', error);
		return null;
	}
};
