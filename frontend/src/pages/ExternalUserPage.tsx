import { useNavigate, useParams } from 'react-router-dom';
import { useDecodePublicLink } from '@/features/social/hooks/usePublicLink';
import { useEffect } from 'react';
import { useLoginInfo } from '@/features/social/hooks/useLoginInfo';

const ExternalUserPage = () => {
	const navigate = useNavigate();
	const { code } = useParams<{ code: string }>();
	const { decodedData, isDecodeLoading, decodeError } = useDecodePublicLink(
		code ?? '',
	);
	const { loginInfo, isLoginInfoLoading } = useLoginInfo();

	useEffect(() => {
		if (!isDecodeLoading && decodedData) {
			if (decodedData.isPublic) {
				if (loginInfo?.isGuest) {
					navigate(`/link/friend/${decodedData.memberId}`);
				} else {
					navigate(`/friend/${decodedData.memberId}`);
				}
			} else {
				alert('공개되지 않은 프로필입니다.');
				navigate('/');
			}
		}
	}, [
		decodedData,
		navigate,
		isDecodeLoading,
		isLoginInfoLoading,
		loginInfo?.isGuest,
	]);

	if (decodeError) return <div>잘못된 링크입니다.</div>;
	else if (isDecodeLoading) return <div>Loading...</div>;
	else return <div> decodedData : {decodedData.memberId}</div>;
};

export default ExternalUserPage;
