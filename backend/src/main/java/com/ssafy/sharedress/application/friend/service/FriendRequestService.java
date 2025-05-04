package com.ssafy.sharedress.application.friend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.friend.dto.FriendRequestDto;
import com.ssafy.sharedress.application.friend.usecase.FriendRequestUseCase;
import com.ssafy.sharedress.domain.friend.entity.Friend;
import com.ssafy.sharedress.domain.friend.entity.FriendRequest;
import com.ssafy.sharedress.domain.friend.error.FriendRequestErrorCode;
import com.ssafy.sharedress.domain.friend.repository.FriendRepository;
import com.ssafy.sharedress.domain.friend.repository.FriendRequestRepository;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FriendRequestService implements FriendRequestUseCase {

	private final MemberRepository memberRepository;
	private final FriendRequestRepository friendRequestRepository;
	private final FriendRepository friendRepository;

	@Transactional
	@Override
	public void sendFriendRequest(Long memberId, FriendRequestDto friendRequest) {
		if (
			friendRequestRepository.existsByMemberId(friendRequest.receiverId(), memberId)
				|| friendRequestRepository.existsByMemberId(memberId, friendRequest.receiverId())
				|| friendRepository.existsByMemberId(memberId, friendRequest.receiverId())
		) {
			return;
		}

		Member requester = memberRepository.getReferenceById(memberId);
		Member receiver = memberRepository.getReferenceById(friendRequest.receiverId());

		friendRequestRepository.save(friendRequest.toEntity(requester, receiver));

		// TODO[준]: 알림 전송
	}

	@Transactional
	@Override
	public void acceptFriendRequest(Long myId, Long friendRequestId) {
		FriendRequest friendRequest = friendRequestRepository.findByIdAndReceiverId(friendRequestId, myId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(FriendRequestErrorCode.FRIEND_REQUEST_NOT_FOUND));

		if (friendRepository.existsByMemberId(
			friendRequest.getRequester().getId(),
			friendRequest.getReceiver().getId()
		)) {
			return;
		}

		Friend friend = new Friend(friendRequest.getRequester(), friendRequest.getReceiver());
		friendRepository.save(friend);

		friendRequestRepository.deleteById(friendRequestId);

		// TODO[준]: 알림 전송
	}

	@Override
	public void rejectFriendRequest(Long myId, Long friendRequestId) {
		FriendRequest friendRequest = friendRequestRepository.findByIdAndReceiverId(friendRequestId, myId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(FriendRequestErrorCode.FRIEND_REQUEST_NOT_FOUND));

		friendRequestRepository.deleteById(friendRequestId);
	}

	@Override
	public void cancelFriendRequest(Long memberId, Long friendRequestId) {
		FriendRequest friendRequest = friendRequestRepository.findByIdAndRequesterId(friendRequestId, memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(FriendRequestErrorCode.FRIEND_REQUEST_NOT_FOUND));

		friendRequestRepository.deleteById(friendRequest.getId());
	}
}
