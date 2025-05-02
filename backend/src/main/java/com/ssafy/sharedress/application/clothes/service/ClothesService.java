package com.ssafy.sharedress.application.clothes.service;

import org.springframework.stereotype.Service;

import com.ssafy.sharedress.application.clothes.dto.PurchaseHistoryRequest;
import com.ssafy.sharedress.application.clothes.usecase.ClothesUseCase;
import com.ssafy.sharedress.domain.brand.entity.Brand;
import com.ssafy.sharedress.domain.brand.repository.BrandRepository;
import com.ssafy.sharedress.domain.clothes.entity.Clothes;
import com.ssafy.sharedress.domain.clothes.repository.ClothesRepository;
import com.ssafy.sharedress.domain.shoppingmall.entity.ShoppingMall;
import com.ssafy.sharedress.domain.shoppingmall.repository.ShoppingMallRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClothesService implements ClothesUseCase {

	private final ClothesRepository clothesRepository;
	private final ShoppingMallRepository shoppingMallRepository;
	private final BrandRepository brandRepository;

	@Override
	public void registerClothesFromPurchase(PurchaseHistoryRequest request) {
		log.info("registerClothesFromPurchase: {}", request);
		request.items().forEach(item -> {
			String nameEn = item.brandNameEng();
			String nameKr = item.brandNameKor();

			Brand brand = brandRepository.findByExactNameEnOrKr(nameEn, nameKr)
				.orElseGet(() -> {
					Brand newBrand = new Brand(nameEn, nameKr);
					return brandRepository.save(newBrand);
				});

			ShoppingMall shoppingMall = shoppingMallRepository.findById(request.shopId())
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 쇼핑몰입니다."));

			Clothes clothes = new Clothes(item.name(), brand, shoppingMall);

			clothesRepository.save(clothes);
		});
	}
}
