import { useMutation } from '@tanstack/react-query';
import fcmApi from '@/features/alert/api/fcmapi';
import { FcmTokenReq } from '@/features/alert/types/alert';

const useFcmToken = () => {
	const {
		mutate: saveToken,
		isPending,
		error,
	} = useMutation<FcmTokenReq, Error, FcmTokenReq>({
		mutationFn: (token: FcmTokenReq) => fcmApi.saveFcmToken(token.fcmToken),
	});

	return { saveToken, isPending, error };
};

export default useFcmToken;
