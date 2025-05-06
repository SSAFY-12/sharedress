import { socialApi } from '@/features/social/api/socialApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FriendRequestList } from '@/features/social/types/social';

const useRequest = () => {
	const queryClient = useQueryClient();

	// 내가 보낸 친구 요청 목록 조회
	const {
		data: friendRequests, // 내가 보낸 친구 요청 목록
		isLoading: isFriendRequestsLoading, // 내가 보낸 친구 요청 목록 로딩
		error: friendRequestsError, // 내가 보낸 친구 요청 목록 에러
	} = useQuery<FriendRequestList, Error>({
		queryKey: ['friendRequests'],
		queryFn: () => socialApi.getFriendRequestList(),
	});

	// 친구 요청 보내기 => 전체 유저에서
	const requestFriend = useMutation({
		mutationFn: (data: { receiverId: number; message: string }) =>
			socialApi.requestFriend(data.receiverId, data.message), // 친구 요청 보내기
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['searchUser'] }); // 친구 요청 보내기 성공 시 친구 검색 목록 갱신
		},
	});

	// 친구 요청 수락
	const acceptRequest = useMutation({
		mutationFn: (requestId: number) => socialApi.acceptFriendRequest(requestId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['searchUser'] }); // 친구 요청 수락 성공 시 친구 검색 목록 갱신
		},
	});

	// 친구 요청 취소
	const cancelRequest = useMutation({
		mutationFn: (requestId: number) => socialApi.cancelFriendRequest(requestId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['searchUser'] }); // 친구 요청 취소 성공 시 친구 검색 목록 갱신
		},
	});

	// 친구 요청 거절
	const rejectRequest = useMutation({
		mutationFn: (requestId: number) => socialApi.rejectFriendRequest(requestId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['searchUser'] }); // 친구 요청 거절 성공 시 친구 검색 목록 갱신
		},
	});

	return {
		// 친구 요청 목록 조회
		friendRequests: friendRequests?.content,
		isFriendRequestsLoading,
		friendRequestsError,

		// 친구 요청 보내기
		requestFriend: requestFriend.mutate, // 친구 요청 보내기
		isRequesting: requestFriend.isPending,
		requestError: requestFriend.error,
		isRequestSuccess: requestFriend.isSuccess,

		// 친구 요청 수락
		acceptRequest: acceptRequest.mutate,
		isAccepting: acceptRequest.isPending,
		acceptError: acceptRequest.error,
		isAcceptSuccess: acceptRequest.isSuccess,

		// 친구 요청 거절
		rejectRequest: rejectRequest.mutate,
		isRejecting: rejectRequest.isPending,
		rejectError: rejectRequest.error,
		isRejectSuccess: rejectRequest.isSuccess,

		// 친구 요청 취소
		cancelRequest: cancelRequest.mutate,
		isCancelling: cancelRequest.isPending,
		cancelError: cancelRequest.error,
		isCancelSuccess: cancelRequest.isSuccess,
	};
};

export default useRequest;
