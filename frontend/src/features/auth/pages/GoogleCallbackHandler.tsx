// src/auth/GoogleCallbackHandler.tsx
// import { useAuthStore } from '@/store/useAuthStore';
import { useCallback, useEffect } from 'react';
import useAuth from '@/features/auth/hooks/useAuth';

const GoogleCallbackHandler = () => {
	const { mutation } = useAuth();

	const handleToken = useCallback(() => {
		const urlHash = new URLSearchParams(window.location.hash.substring(1));
		const accessToken = urlHash.get('access_token');

		if (accessToken) {
			console.log(accessToken, 'test!!!!!!!!');
			mutation.mutate(accessToken);
		} else {
			console.error('No access token found');
		}
	}, [mutation]);

	useEffect(() => {
		handleToken();
	}, [handleToken]);

	return <div>구글 로그인 중입니다...</div>;
};

export default GoogleCallbackHandler;
