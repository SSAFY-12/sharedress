import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
	exp: number;
	[key: string]: any;
}

export const isTokenValid = (token: string | null): boolean => {
	if (!token) return false;

	try {
		const decoded = jwtDecode<DecodedToken>(token); // 토큰 디코딩
		const currentTime = Date.now() / 1000; // 현재 시간을 초 단위로 변환
		return decoded.exp > currentTime; // 토큰 만료 시간이 현재 시간보다 크면 유효
	} catch (error) {
		console.error('Token validation error:', error);
		return false;
	}
};

export const getTokenExpiration = (token: string): number | null => {
	try {
		const decoded = jwtDecode<DecodedToken>(token); // 토큰 디코딩
		return decoded.exp; // 토큰 만료 시간 반환
	} catch (error) {
		console.error('Token decoding error:', error);
		return null;
	}
};
