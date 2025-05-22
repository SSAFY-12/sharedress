package com.ssafy.sharedress.adapter.ai.out.persistence;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.sharedress.domain.ai.entity.AiTask;
import com.ssafy.sharedress.domain.ai.repository.AiTaskRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AiTaskPersistenceAdapter implements AiTaskRepository {

	private final AiTaskJpaRepository aiTaskJpaRepository;

	@Override
	public AiTask save(AiTask aiTask) {
		return aiTaskJpaRepository.save(aiTask);
	}

	@Override
	public Optional<AiTask> findById(String id) {
		return aiTaskJpaRepository.findById(id);
	}

	@Override
	public Optional<AiTask> findByIdAndShopId(String id, Long shopId) {
		return aiTaskJpaRepository.findByIdAndShopId(id, shopId);
	}
}
