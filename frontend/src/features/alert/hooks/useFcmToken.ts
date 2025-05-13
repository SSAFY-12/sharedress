import { useMutation } from '@tanstack/react-query';
import fcmApi from '@/features/alert/api/fcmapi';
import { FcmTokenReq } from '@/features/alert/types/alert';
import useFcmStore from '@/store/useFcmStore';

const useFcmToken = () => {
	const { token: fcmToken } = useFcmStore();

	const {
		mutate: saveToken,
		isPending,
		error,
	} = useMutation<FcmTokenReq, Error, FcmTokenReq>({
		mutationFn: (token: FcmTokenReq) => fcmApi.saveFcmToken(token.fcmToken),
	});

	// 토큰 저장 함수를 단순화
	const saveFcmToken = () => {
		if (fcmToken) {
			saveToken({ fcmToken });
		}
	};

	return { saveToken, saveFcmToken, isPending, error };
};

export default useFcmToken;
