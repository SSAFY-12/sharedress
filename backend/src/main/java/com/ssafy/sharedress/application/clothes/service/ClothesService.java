package com.ssafy.sharedress.application.clothes.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.clothes.dto.PurchaseHistoryRequest;
import com.ssafy.sharedress.application.clothes.usecase.ClothesUseCase;
import com.ssafy.sharedress.domain.brand.entity.Brand;
import com.ssafy.sharedress.domain.brand.repository.BrandRepository;
import com.ssafy.sharedress.domain.closet.entity.Closet;
import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.closet.error.ClosetErrorCode;
import com.ssafy.sharedress.domain.closet.repository.ClosetClothesRepository;
import com.ssafy.sharedress.domain.closet.repository.ClosetRepository;
import com.ssafy.sharedress.domain.clothes.entity.Clothes;
import com.ssafy.sharedress.domain.clothes.repository.ClothesRepository;
import com.ssafy.sharedress.domain.shoppingmall.entity.ShoppingMall;
import com.ssafy.sharedress.domain.shoppingmall.error.ShoppingMallErrorCode;
import com.ssafy.sharedress.domain.shoppingmall.repository.ShoppingMallRepository;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClothesService implements ClothesUseCase {

	private final ClothesRepository clothesRepository;
	private final ShoppingMallRepository shoppingMallRepository;
	private final BrandRepository brandRepository;
	private final ClosetRepository closetRepository;
	private final ClosetClothesRepository closetClothesRepository;

	@Override
	@Transactional
	public void registerClothesFromPurchase(PurchaseHistoryRequest request, Long memberId) {
		Long shopId = request.shopId();

		ShoppingMall shoppingMall = shoppingMallRepository.findById(shopId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(ShoppingMallErrorCode.SHOPPING_MALL_NOT_FOUND));

		Closet closet = closetRepository.findByMemberId(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(ClosetErrorCode.CLOSET_NOT_FOUND));

		request.items().forEach(item -> {
			// 브랜드 처리
			Brand brand = brandRepository.findByExactNameEnOrKr(item.brandNameEng(), item.brandNameKor())
				.orElseGet(() -> brandRepository.save(new Brand(item.brandNameEng(), item.brandNameKor())));

			// 라이브러리에 해당 브랜드-상품명 존재하는지 확인
			Optional<Clothes> existing = clothesRepository.findByNameAndBrandId(item.name(), brand.getId());

			// 있으면 재사용, 없으면 새로 등록 + 메시지큐 발행
			Clothes clothes = existing.orElseGet(() -> {
				Clothes newClothes = new Clothes(item.name(), brand, shoppingMall, item.linkUrl());

				// TODO[지윤] : AI 서버로 전처리 메시지 발행

				return clothesRepository.save(newClothes);
			});

			// 내 옷장에 등록
			ClosetClothes closetClothes = new ClosetClothes(closet, clothes);

			// 라이브러리에 존재하는 경우 ai 서버 거치지 않고 imageUrl 복사
			if (existing.isPresent()) {
				closetClothes.updateImgUrl(clothes.getImageUrl());
			}
			closetClothes.updateIsPublic(true); // 기본 공개
			closetClothesRepository.save(closetClothes);

			log.info("내옷장옷 등록 완료 clothesId={}, closetId={}", clothes.getId(), closet.getId());
		});
	}

}
