package com.ssafy.sharedress.adapter.closet.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;

public interface ClosetClothesJpaRepository extends JpaRepository<ClosetClothes, Long> {
}
