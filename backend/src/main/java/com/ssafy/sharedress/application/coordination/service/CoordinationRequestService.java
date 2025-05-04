package com.ssafy.sharedress.application.coordination.service;

import org.springframework.stereotype.Service;

import com.ssafy.sharedress.application.coordination.dto.CoordinationRequestRequest;
import com.ssafy.sharedress.application.coordination.usecase.CoordinationRequestUseCase;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationRequestRepository;
import com.ssafy.sharedress.domain.friend.repository.FriendRepository;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CoordinationRequestService implements CoordinationRequestUseCase {

	private final MemberRepository memberRepository;
	private final FriendRepository friendRepository;
	private final CoordinationRequestRepository coordinationRequestRepository;

	@Override
	public void sendCoordinationRequest(Long myId, CoordinationRequestRequest request) {
		Member requester = memberRepository.getReferenceById(myId);
		Member receiver = memberRepository.getReferenceById(request.receiverId());

		if (!friendRepository.existsByMemberId(requester.getId(), receiver.getId())) {
			return;
		}

		coordinationRequestRepository.save(
			request.toEntity(
				requester,
				receiver
			)
		);

		// TODO[준]: 알림 전송 로직 추가
	}
}
