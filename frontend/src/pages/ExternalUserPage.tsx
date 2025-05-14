import { useNavigate, useParams } from 'react-router-dom';
import { useDecodePublicLink } from '@/features/social/hooks/usePublicLink';
import { useEffect } from 'react';
// import { useLoginInfo } from '@/features/social/hooks/useLoginInfo';
import { useAuthStore } from '@/store/useAuthStore';

const ExternalUserPage = () => {
	const navigate = useNavigate();
	const { code } = useParams<{ code: string }>();
	const token = useAuthStore((state) => state.accessToken); // 토큰으로 판단

	const { decodedData, isDecodeLoading, decodeError } = useDecodePublicLink(
		code ?? '',
	);
	// const { loginInfo, isLoginInfoLoading } = useLoginInfo();

	useEffect(() => {
		if (!isDecodeLoading && decodedData) {
			if (decodedData.isPublic) {
				if (!token) {
					// 토큰이 없으면 비회원으로 간주
					navigate(`/link/friend/${decodedData.memberId}`);
				} else {
					navigate(`/friend/${decodedData.memberId}`);
				}
			}
		}
	}, [decodedData, token, navigate, isDecodeLoading]);

	if (decodeError) return <div>잘못된 링크입니다.</div>;
	else if (isDecodeLoading) return <div>Loading...</div>;
	else return <div> decodedData : {decodedData.memberId}</div>;
};

export default ExternalUserPage;
