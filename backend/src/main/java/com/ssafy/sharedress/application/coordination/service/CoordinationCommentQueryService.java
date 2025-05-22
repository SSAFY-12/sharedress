package com.ssafy.sharedress.application.coordination.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.coordination.dto.CoordinationCommentResponse;
import com.ssafy.sharedress.application.coordination.usecase.CoordinationCommentQueryUseCase;
import com.ssafy.sharedress.domain.coordination.repository.CoordinationCommentRepository;

import lombok.RequiredArgsConstructor;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class CoordinationCommentQueryService implements CoordinationCommentQueryUseCase {

	private final CoordinationCommentRepository coordinationCommentRepository;

	@Override
	public List<CoordinationCommentResponse> getCoordinationComments(Long coordinationId, Long memberId) {
		return coordinationCommentRepository.findByCoordinationId(coordinationId)
			.stream()
			.map(CoordinationCommentResponse::from)
			.toList();
	}
}
