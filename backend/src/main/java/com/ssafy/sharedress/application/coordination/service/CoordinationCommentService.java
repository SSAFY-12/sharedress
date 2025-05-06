package com.ssafy.sharedress.application.coordination.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.coordination.dto.CoordinationCommentResponse;
import com.ssafy.sharedress.application.coordination.dto.CreateCommentRequest;
import com.ssafy.sharedress.application.coordination.usecase.CoordinationCommentUseCase;
import com.ssafy.sharedress.domain.coordination.entity.Coordination;
import com.ssafy.sharedress.domain.coordination.entity.CoordinationComment;
import com.ssafy.sharedress.domain.coordination.error.CoordinationCommentErrorCode;
import com.ssafy.sharedress.domain.coordination.error.CoordinationErrorCode;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationCommentRepository;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationRepository;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.error.MemberErrorCode;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CoordinationCommentService implements CoordinationCommentUseCase {

	private final CoordinationRepository coordinationRepository;
	private final MemberRepository memberRepository;
	private final CoordinationCommentRepository coordinationCommentRepository;

	@Override
	@Transactional
	public CoordinationCommentResponse create(Long coordinationId, CreateCommentRequest request, Long memberId) {
		Coordination coordination = coordinationRepository.findById(coordinationId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(CoordinationErrorCode.COORDINATION_NOT_FOUND));

		Member member = memberRepository.findById(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));

		CoordinationComment parent = null;
		int depth = 0;

		if (request.parentId() != null) {
			parent = coordinationCommentRepository.findById(request.parentId())
				.orElseThrow(ExceptionUtil.exceptionSupplier(CoordinationCommentErrorCode.PARENT_COMMENT_NOT_FOUND));

			if (parent.getDepth() >= 1) {
				ExceptionUtil.throwException(CoordinationCommentErrorCode.CANNOT_REPLY_TO_CHILD_COMMENT);
			}

		}

		CoordinationComment comment = new CoordinationComment(
			request.content(),
			depth,
			parent,
			coordination,
			member
		);

		coordinationCommentRepository.save(comment);
		return CoordinationCommentResponse.from(comment);
	}
}
