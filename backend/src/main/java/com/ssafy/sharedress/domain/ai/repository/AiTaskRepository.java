package com.ssafy.sharedress.domain.ai.repository;

import java.util.Optional;

import com.ssafy.sharedress.domain.ai.entity.AiTask;

public interface AiTaskRepository {
	AiTask save(AiTask aiTask);

	Optional<AiTask> findById(String id);

	Optional<AiTask> findByIdAndShopId(String id, Long shopId);
}
