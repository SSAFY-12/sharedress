import { useRef, useEffect } from 'react';
import useAuth from '@/features/auth/hooks/useAuth';
import LoadingOverlay from '@/components/etc/LoadingOverlay';

const GoogleCallbackHandler = () => {
	const { mutation } = useAuth();
	const calledRef = useRef(false);

	useEffect(() => {
		const handleToken = async () => {
			if (calledRef.current) return;
			calledRef.current = true;

			try {
				const urlHash = new URLSearchParams(window.location.hash.substring(1));
				const accessToken = urlHash.get('access_token');
				// console.log('콜백 accessToken:', accessToken); // 디버깅용
				if (!accessToken) return;
				await mutation.mutateAsync(accessToken);
			} catch (error) {
				console.error('토큰 검증 실패:', error);
			}
		};
		handleToken();
	}, [mutation]);

	if (mutation.isPending) {
		return <LoadingOverlay message='구글 로그인 중입니다...' />;
	}
	if (mutation.isError) {
		return <div>로그인 실패! 다시 시도해주세요.</div>;
	}
	return <LoadingOverlay message='구글 로그인 중입니다...' />;
};

export default GoogleCallbackHandler;
