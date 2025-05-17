package com.ssafy.sharedress.adapter.ai.out.persistence;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.sharedress.domain.ai.entity.AiTask;

public interface AiTaskJpaRepository extends JpaRepository<AiTask, String> {
	@Query("SELECT a FROM AiTask a WHERE a.id = :taskId AND a.shoppingMall.id = :shopId")
	Optional<AiTask> findByIdAndShopId(@Param("taskId") String taskId, @Param("shopId") Long shopId);
}
