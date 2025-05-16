import { useQuery } from '@tanstack/react-query';
import { ClosetApis } from '@/features/regist/api/registApis';
import { useClosetStore } from '@/store/useClosetStore';
import { MyClosetResponse } from '@/features/regist/api/registApis';
import { useEffect } from 'react';

export const useGetCloth = () => {
	const setCloset = useClosetStore((state) => state.setCloset);

	const { data, isLoading, isSuccess } = useQuery<MyClosetResponse, Error>({
		queryKey: ['cloth'],
		queryFn: () => ClosetApis.getMyCloset(),
	});

	useEffect(() => {
		if (isSuccess) {
			setCloset(data.content);
			console.log('hooks: Success settingCloset', data.content);
		}
	}, [isSuccess, data, setCloset]);
	return { data, isLoading, isSuccess };
};
