import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '@/store/useAuthStore';

interface RefreshResState {
	content: {
		accessToken: string;
	};
}

const useRefresh = () => {
	const { setAccessToken } = useAuthStore();

	const mutation = useMutation({
		mutationFn: () => authApi.refresh(),
		onSuccess: (data: RefreshResState) => {
			console.log('BE 데이터 값 확인 : ', data, 'refresh 토큰 갱신');
			setAccessToken(data.content.accessToken); //refresh 토큰 갱신
		},
	});

	return mutation;
};

export default useRefresh;
