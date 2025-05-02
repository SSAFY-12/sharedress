package com.ssafy.sharedress.adapter.clothes.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.sharedress.domain.clothes.entity.Clothes;

public interface ClothesJpaRepository extends JpaRepository<Clothes, Long> {
}
