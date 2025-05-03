import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
	exp: number;
	[key: string]: any;
}

export const isTokenValid = (token: string | null): boolean => {
	if (!token) return false;

	try {
		const decoded = jwtDecode<DecodedToken>(token);
		const currentTime = Date.now() / 1000;
		return decoded.exp > currentTime;
	} catch (error) {
		console.error('Token validation error:', error);
		return false;
	}
};

export const getTokenExpiration = (token: string): number | null => {
	try {
		const decoded = jwtDecode<DecodedToken>(token);
		return decoded.exp;
	} catch (error) {
		console.error('Token decoding error:', error);
		return null;
	}
};
