import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileModifyApi, Profile } from '@/features/social/api/socialApi';
import { useProfileStore } from '@/store/useProfileStore';

export const useModifyProfile = () => {
	const queryClient = useQueryClient();
	const setIsPublic = useProfileStore((state) => state.setIsPublic);

	return useMutation({
		mutationFn: (profile: Profile) => profileModifyApi.modifyProfile(profile),
		onMutate: async (newProfile) => {
			// 이전 상태 저장
			console.log(newProfile, 'newProfile');
			const previousProfile = queryClient.getQueryData(['myProfile']);
			// UI 즉시 반영
			setIsPublic(newProfile.isPublic ?? true);
			queryClient.setQueryData(['myProfile'], newProfile);

			return { previousProfile };
		},
		onSuccess: (data) => {
			// 프로필 수정 성공 시 캐시 무효화 및 새로운 데이터 가져오기
			queryClient.invalidateQueries({ queryKey: ['myProfile'] });
			return { data, success: true };
		},
		onError: (error, newProfile, context) => {
			// 에러 발생 시 이전 상태로 롤백
			if (context?.previousProfile) {
				queryClient.setQueryData(['myProfile'], context.previousProfile);
			}
			setIsPublic(!(newProfile.isPublic ?? true)); // 이전 상태로 롤백
			console.error('프로필 수정 실패:', error);
			return { success: false };
		},
	});
};
