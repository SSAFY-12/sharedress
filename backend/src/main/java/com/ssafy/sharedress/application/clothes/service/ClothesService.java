package com.ssafy.sharedress.application.clothes.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.adapter.clothes.out.messaging.SqsMessageSender;
import com.ssafy.sharedress.application.clothes.dto.AiProcessMessageRequest;
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
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.error.MemberErrorCode;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;
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

	private final MemberRepository memberRepository;
	private final ClothesRepository clothesRepository;
	private final ShoppingMallRepository shoppingMallRepository;
	private final BrandRepository brandRepository;
	private final ClosetRepository closetRepository;
	private final ClosetClothesRepository closetClothesRepository;
	private final SqsMessageSender sqsMessageSender;

	@Override
	@Transactional
	public void registerClothesFromPurchase(PurchaseHistoryRequest request, Long memberId) {

		Member member = memberRepository
			.findById(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));

		ShoppingMall shoppingMall = shoppingMallRepository.findById(request.shopId())
			.orElseThrow(ExceptionUtil.exceptionSupplier(ShoppingMallErrorCode.SHOPPING_MALL_NOT_FOUND));

		Closet closet = closetRepository.findByMemberId(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(ClosetErrorCode.CLOSET_NOT_FOUND));

		List<AiProcessMessageRequest.ItemInfo> itemsToProcess = new ArrayList<>();

		request.items().forEach(item -> {

			// 브랜드 조회 또는 저장
			Brand brand = brandRepository.findByExactNameEnOrKr(item.brandNameEng(), item.brandNameKor())
				.orElseGet(() -> brandRepository.save(new Brand(item.brandNameEng(), item.brandNameKor())));

			// 라이브러리 조회 (상품명 + 브랜드 ID 기준)
			Optional<Clothes> existing = clothesRepository.findByNameAndBrandId(item.name(), brand.getId());

			// Clothes 객체 (있으면 재사용, 없으면 생성 및 저장)
			Clothes clothes = existing.orElseGet(() ->
				clothesRepository.save(new Clothes(item.name(), brand, shoppingMall, item.linkUrl()))
			);

			// 내 옷장에 이미 있는 옷인지 확인
			boolean alreadyExists = closetClothesRepository.existsByClosetIdAndClothesId(closet.getId(),
				clothes.getId());
			if (alreadyExists) {
				log.info("중복된 옷: clothesId={}, closetId={}", clothes.getId(), closet.getId());
				return; // 중복된 옷이면 해당 옷은 skip
			}

			// 전처리 대상이면 AI 메시지큐 발행
			if (existing.isEmpty()) {
				itemsToProcess.add(new AiProcessMessageRequest.ItemInfo(clothes.getId(), item.linkUrl()));
				log.info("AI 처리 요청 발행됨: clothesId={}, memberId={}", clothes.getId(), memberId);
			}

			// 내 옷장에 등록
			ClosetClothes closetClothes = new ClosetClothes(closet, clothes);
			if (existing.isPresent()) {
				closetClothes.updateImgUrl(clothes.getImageUrl());
			}
			closetClothes.updateIsPublic(true); // 기본 공개
			closetClothesRepository.save(closetClothes);
			log.info("내 옷장 등록 완료: clothesId={}, closetId={}", clothes.getId(), closet.getId());
		});
		// 한번에 SQS로 전송
		if (!itemsToProcess.isEmpty()) {
			AiProcessMessageRequest message = new AiProcessMessageRequest(memberId, member.getFcmToken(),
				itemsToProcess);
			sqsMessageSender.send(message);
		}
	}

}
