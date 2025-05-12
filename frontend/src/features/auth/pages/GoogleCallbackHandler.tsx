// src/auth/GoogleCallbackHandler.tsx
// import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';
import useAuth from '@/features/auth/hooks/useAuth';

const GoogleCallbackHandler = () => {
	const { mutation } = useAuth();

	useEffect(() => {
		const handleToken = async () => {
			try {
				const urlHash = new URLSearchParams(window.location.hash.substring(1));
				const accessToken = urlHash.get('access_token');

				if (!accessToken) {
					console.error('토큰을 찾을 수 없습니다.');
					return;
				}

				await mutation.mutateAsync(accessToken);
			} catch (error) {
				console.error('토큰 검증 실패:', error);
			}
		};

		handleToken();
	}, [mutation]);

	return <div>구글 로그인 중입니다...</div>;
};

export default GoogleCallbackHandler;
