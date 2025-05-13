import { useQuery } from '@tanstack/react-query';
import { getMyLoginInfo } from '@/features/social/api/socialApi';
import { useProfileStore } from '@/store/useProfileStore';
import { useEffect } from 'react';

/** 실제 응답 타입에 맞춰 정의 */
interface LoginInfo {
	id: number;
	isGuest: boolean;
}

export const useLoginInfo = () => {
	/** zustand state setters */
	const setIsGuest = useProfileStore((s) => s.setIsGuest);
	const setMyId = useProfileStore((s) => s.setMyId);

	const { data, isLoading, error } = useQuery<LoginInfo>({
		queryKey: ['loginInfo'],
		queryFn: async () => {
			const data = await getMyLoginInfo();
			return data;
		},
	});

	useEffect(() => {
		if (data) {
			setIsGuest(data.isGuest);
			setMyId(data.id);
		}
	}, [data, setIsGuest, setMyId]);

	return {
		loginInfo: data,
		isLoginInfoLoading: isLoading,
		loginInfoError: error,
	};
};
