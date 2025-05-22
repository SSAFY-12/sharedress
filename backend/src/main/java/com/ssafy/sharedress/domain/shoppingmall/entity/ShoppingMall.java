package com.ssafy.sharedress.domain.shoppingmall.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "shopping_mall")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ShoppingMall {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;

	private String urlLink;

	private String historyUrlLink;
}
