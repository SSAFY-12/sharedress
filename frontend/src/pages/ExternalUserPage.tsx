import { useNavigate, useParams } from 'react-router-dom';
import { useDecodePublicLink } from '@/features/social/hooks/usePublicLink';
import { useEffect } from 'react';

const ExternalUserPage = () => {
	const navigate = useNavigate();
	const { code } = useParams<{ code: string }>();
	const { decodedData, isLoading, error } = useDecodePublicLink(code ?? '');

	useEffect(() => {
		if (!isLoading && decodedData) {
			if (decodedData.isPublic) {
				navigate(`/friend/${decodedData.memberId}`);
			} else {
				alert('공개되지 않은 프로필입니다.');
				navigate('/');
			}
		}
	}, [decodedData, navigate, isLoading]);

	if (error) return <div>잘못된 링크입니다.</div>;
	else if (isLoading) return <div>Loading...</div>;
	else return <div> decodedData : {decodedData.memberId}</div>;
};

export default ExternalUserPage;
