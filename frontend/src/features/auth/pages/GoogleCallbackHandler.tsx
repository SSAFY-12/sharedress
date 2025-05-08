// src/auth/GoogleCallbackHandler.tsx
// import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/features/auth/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';

const GoogleCallbackHandler = () => {
	const { mutation } = useAuth();
	const navigate = useNavigate();
	const accessToken = useAuthStore((state) => state.accessToken);

	useEffect(() => {
		const handleToken = () => {
			const urlHash = new URLSearchParams(window.location.hash.substring(1));
			const accessToken = urlHash.get('access_token');

			if (accessToken) {
				console.log(accessToken, 'test!!!!!!!!');
				mutation.mutate(accessToken, {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [navigate]);

	// accessToken이 store에 저장된 후에만 wardrobe로 이동
	useEffect(() => {
		if (accessToken) {
			navigate('/wardrobe');
		}
	}, [accessToken, navigate]);

	return <div>구글 로그인 중입니다...</div>;
};

export default GoogleCallbackHandler;
