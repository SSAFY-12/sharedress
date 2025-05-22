export interface TokenResponse {
	content: {
		accessToken: string; // 액세스 토큰
		refreshToken?: string; // 리프레시 토큰
	};
}
