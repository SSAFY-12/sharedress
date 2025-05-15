import { useNavigate, useParams } from 'react-router-dom';
import { useDecodePublicLink } from '@/features/social/hooks/usePublicLink';
import { useEffect, useRef } from 'react';
// import { useLoginInfo } from '@/features/social/hooks/useLoginInfo';
import { useAuthStore } from '@/store/useAuthStore';

const ExternalUserPage = () => {
	const navigate = useNavigate();
	const { code } = useParams<{ code: string }>();
	const { accessToken, setAccessToken } = useAuthStore();
	const { setIsGuest } = useAuthStore();

	const { decodedData, isDecodeLoading, decodeError } = useDecodePublicLink(
		code ?? '',
	);

	const hasRedirectedRef = useRef(false);

	useEffect(() => {
		if (hasRedirectedRef.current) return;
		if (!isDecodeLoading && decodedData) {
			if (decodedData.isPublic) {
				hasRedirectedRef.current = true; // 이후 실행 방지

				if (!accessToken) {
					setAccessToken('111');
					setIsGuest(true);
					navigate(`/link/friend/${decodedData.memberId}`);
				} else {
					navigate(`/friend/${decodedData.memberId}`);
				}
			}
		}
	}, [
		decodedData,
		accessToken,
		navigate,
		isDecodeLoading,
		setAccessToken,
		setIsGuest,
	]);

	if (decodeError) return <div>잘못된 링크입니다.</div>;
	else if (isDecodeLoading) return <div>Loading...</div>;
	else return <div> decodedData : {decodedData.memberId}</div>;
};

export default ExternalUserPage;
