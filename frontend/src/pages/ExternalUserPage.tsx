import { useNavigate, useParams } from 'react-router-dom';
import { useDecodePublicLink } from '@/features/social/hooks/usePublicLink';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

const ExternalUserPage = () => {
	const navigate = useNavigate();
	const { code } = useParams<{ code: string }>();

	const { decodedData, isDecodeLoading, decodeError } = useDecodePublicLink(
		code ?? '',
	);

	useEffect(() => {
		if (!isDecodeLoading && decodedData) {
			if (decodedData.isPublic) {
				// 게스트 토큰이 있는지 확인
				const guestToken = document.cookie
					.split('; ')
					.find((row) => row.startsWith('guestToken='))
					?.split('=')[1];

				if (guestToken) {
					useAuthStore.setState({
						accessToken: guestToken,
						isAuthenticated: true,
						isInitialized: true,
						isGuest: true,
					});
					setTimeout(() => {
						console.log('auth-storage:', localStorage.getItem('auth-storage'));
						navigate(`/link/friend/${decodedData.memberId}`);
					}, 100);
				} else {
					navigate(`/link/friend/${decodedData.memberId}`);
				}
			}
		}
	}, [decodedData, navigate, isDecodeLoading]);

	if (decodeError) return <div>잘못된 링크입니다.</div>;
	else if (isDecodeLoading) return <div>Loading...</div>;
	else return <div> decodedData : {decodedData.memberId}</div>;
};

export default ExternalUserPage;
