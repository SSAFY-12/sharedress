package com.ssafy.sharedress.application.friend.service;

import org.springframework.stereotype.Service;

import com.ssafy.sharedress.application.friend.dto.FriendRequestDto;
import com.ssafy.sharedress.application.friend.usecase.FriendRequestUseCase;
import com.ssafy.sharedress.domain.friend.repository.FriendRequestRepository;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FriendRequestService implements FriendRequestUseCase {

	private final MemberRepository memberRepository;
	private final FriendRequestRepository friendRequestRepository;

	@Override
	public void sendFriendRequest(Long memberId, FriendRequestDto friendRequest) {
		if (
			friendRequestRepository.existsByMemberId(friendRequest.receiverId(), memberId)
				|| friendRequestRepository.existsByMemberId(memberId, friendRequest.receiverId())
		) {
			return;
		}

		Member requester = memberRepository.getReferenceById(memberId);
		Member receiver = memberRepository.getReferenceById(friendRequest.receiverId());

		// TODO[준]: 알림 전송

		friendRequestRepository.save(friendRequest.toEntity(requester, receiver));
	}
}
