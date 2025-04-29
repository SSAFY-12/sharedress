package com.ssafy.sharedress.domain.closet.entity;

import com.ssafy.sharedress.domain.clothes.entity.Clothes;
import com.ssafy.sharedress.domain.common.entity.BaseTimeEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "closet_clothes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ClosetClothes extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "closet_id", nullable = false)
	private Closet closet;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "clothes_id", nullable = false)
	private Clothes clothes;

	private String imageUrl;

	private Boolean isPublic;

	// 사용자 커스터마이징 정보 (nullable)
	private String customName;

	private String customColor;

	private Long customBrandId;

	private Long customCategoryId;
}

