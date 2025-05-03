import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/store/useAuthStore';

interface RefreshResState {
	content: {
		accessToken: string;
	};
}

const useRefresh = () => {
	const { setAccessToken } = useAuthStore();

	// mutation 반환값 -> mutate, mutateAsync, isPending, isSuccess, isError, error
	const mutation = useMutation({
		mutationFn: () => authApi.refresh(), // 리프레시 토큰 갱신
		onSuccess: (data: RefreshResState) => {
			console.log('BE 데이터 값 확인 : ', data, 'refresh 토큰 갱신');
			setAccessToken(data.content.accessToken); // refresh 토큰 갱신
		},
	});

	return mutation;
};

export default useRefresh;
