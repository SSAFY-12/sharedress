export interface TokenResponse {
	content: {
		accessToken: string;
		refreshToken?: string;
	};
}
