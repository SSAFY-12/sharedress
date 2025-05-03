import { socialApi } from '@/features/social/api/socialApi';
import { useMutation } from '@tanstack/react-query';
import {
	FriendRequest,
	AcceptFriendRequest,
	RejectFriendRequest,
} from '@/features/social/types/social';

const useRequest = () => {
	// 친구 요청 보내기 -> 데이터가 필요할시 voidX / api 호출 실패시 발생하는 에러 / mutation 함수에 전달되는 파라미터
	const requestMutation = useMutation<void, Error, FriendRequest>({
		mutationFn: (requestData) =>
			socialApi.requestFriend(requestData.receiverId, requestData.message),
	});

	// 친구 요청 수락
	const acceptMutation = useMutation<void, Error, AcceptFriendRequest>({
		mutationFn: (requestData) =>
			socialApi.acceptFriendRequest(requestData.requestId),
	});

	// 친구 요청 거절
	const rejectMutation = useMutation<void, Error, RejectFriendRequest>({
		mutationFn: (requestData) =>
			socialApi.rejectFriendRequest(requestData.requestId),
	});

	return {
		// 친구 요청 보내기
		requestFriend: requestMutation.mutate,
		isRequesting: requestMutation.isPending,
		requestError: requestMutation.error,
		isRequestSuccess: requestMutation.isSuccess,

		// 친구 요청 수락
		acceptRequest: acceptMutation.mutate,
		isAccepting: acceptMutation.isPending,
		acceptError: acceptMutation.error,
		isAcceptSuccess: acceptMutation.isSuccess,

		// 친구 요청 거절
		rejectRequest: rejectMutation.mutate,
		isRejecting: rejectMutation.isPending,
		rejectError: rejectMutation.error,
		isRejectSuccess: rejectMutation.isSuccess,
	};
};

export default useRequest;
