package com.ssafy.sharedress.domain.clothes.entity;

import java.util.ArrayList;
import java.util.List;

import com.ssafy.sharedress.domain.brand.entity.Brand;
import com.ssafy.sharedress.domain.category.entity.Category;
import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.color.entity.Color;
import com.ssafy.sharedress.domain.common.entity.BaseTimeEntity;
import com.ssafy.sharedress.domain.shoppingmall.entity.ShoppingMall;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "clothes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Clothes extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	private String imageUrl;

	@Column(nullable = false)
	@Convert(converter = ClothesSourceTypeConverter.class)
	private ClothesSourceType type;

	private String goodsLinkUrl;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "brand_id")
	private Brand brand;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "color_id")
	private Color color;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "category_id")
	private Category category;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "shopping_mall_id")
	private ShoppingMall shoppingMall;

	@OneToMany(mappedBy = "clothes", cascade = CascadeType.REMOVE, orphanRemoval = true)
	private List<ClosetClothes> closetClothesList = new ArrayList<>();

	public Clothes(String name, Brand brand, ShoppingMall shoppingMall, String goodsLinkUrl) {
		this.name = name;
		this.brand = brand;
		this.shoppingMall = shoppingMall;
		this.goodsLinkUrl = goodsLinkUrl;
		this.type = ClothesSourceType.SHOPPING_MALL;
	}
}
