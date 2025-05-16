package com.ssafy.sharedress.adapter.ai.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.sharedress.domain.ai.entity.AiTask;

public interface AiTaskJpaRepository extends JpaRepository<AiTask, String> {
}
