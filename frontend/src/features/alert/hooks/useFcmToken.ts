import { useQuery } from '@tanstack/react-query';
import fcmApi from '@/features/alert/api/fcmapi';

const useFcmToken = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['fcmToken'],
		queryFn: () => fcmApi.getFcmToken(),
	});

	return { data, isLoading, error };
};

export default useFcmToken;
