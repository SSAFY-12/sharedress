import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileModifyApi, Profile } from '../api/socialApi';
import { useProfileStore } from '@/store/useProfileStore';

export const useModifyProfile = () => {
	const queryClient = useQueryClient();
	const setIsPublic = useProfileStore((state) => state.setIsPublic);

	return useMutation({
		mutationFn: (profile: Profile) => profileModifyApi.modifyProfile(profile),
		onSuccess: (data) => {
			// 프로필 수정 성공 시 캐시 업데이트
			queryClient.setQueryData(['myProfile'], data);
			// Zustand store 업데이트
			setIsPublic(data.isPublic);
			console.log(data);
		},
	});
};
