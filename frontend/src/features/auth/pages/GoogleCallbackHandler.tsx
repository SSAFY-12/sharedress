// src/auth/GoogleCallbackHandler.tsx
// import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/features/auth/hooks/useAuth';

const GoogleCallbackHandler = () => {
	const { mutation } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const handleToken = () => {
			const urlHash = new URLSearchParams(window.location.hash.substring(1));
			const accessToken = urlHash.get('access_token');

			if (accessToken) {
				console.log(accessToken, 'test!!!!!!!!');
				mutation.mutate(accessToken, {
					onSuccess: () => {
						navigate('/wardrobe');
					},
					onError: (error) => {
						console.error('토큰 검증 실패:', error);
						navigate('/login');
					},
				});
			} else {
				console.error('토큰을 찾을 수 없습니다.');
				navigate('/login');
			}
		};

		handleToken();
	}, [mutation, navigate]);

	return <div>구글 로그인 중입니다...</div>;
};

export default GoogleCallbackHandler;
