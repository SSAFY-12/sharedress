package com.ssafy.sharedress.application.closet.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.adapter.clothes.out.messaging.SqsMessageSender;
import com.ssafy.sharedress.application.closet.dto.ClosetClothesDetailResponse;
import com.ssafy.sharedress.application.closet.dto.ClosetClothesUpdateRequest;
import com.ssafy.sharedress.application.closet.usecase.ClosetClothesUseCase;
import com.ssafy.sharedress.application.clothes.dto.AiProcessMessageRequest;
import com.ssafy.sharedress.application.clothes.dto.PurchaseHistoryRequest;
import com.ssafy.sharedress.domain.brand.entity.Brand;
import com.ssafy.sharedress.domain.brand.repository.BrandRepository;
import com.ssafy.sharedress.domain.category.entity.Category;
import com.ssafy.sharedress.domain.category.repository.CategoryRepository;
import com.ssafy.sharedress.domain.closet.entity.Closet;
import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.closet.error.ClosetClothesErrorCode;
import com.ssafy.sharedress.domain.closet.error.ClosetErrorCode;
import com.ssafy.sharedress.domain.closet.repository.ClosetClothesRepository;
import com.ssafy.sharedress.domain.closet.repository.ClosetRepository;
import com.ssafy.sharedress.domain.clothes.entity.Clothes;
import com.ssafy.sharedress.domain.clothes.repository.ClothesRepository;
import com.ssafy.sharedress.domain.color.entity.Color;
import com.ssafy.sharedress.domain.color.repository.ColorRepository;
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
public class ClosetClothesService implements ClosetClothesUseCase {

	private final CategoryRepository categoryRepository;
	private final ColorRepository colorRepository;
	private final BrandRepository brandRepository;
	private final ClosetClothesRepository closetClothesRepository;
	private final MemberRepository memberRepository;
	private final ClosetRepository closetRepository;
	private final ClothesRepository clothesRepository;
	private final ShoppingMallRepository shoppingMallRepository;
	private final SqsMessageSender sqsMessageSender;

	@Transactional
	@Override
	public ClosetClothesDetailResponse updateClosetClothes(
		Long memberId,
		Long closetClothesId,
		ClosetClothesUpdateRequest request
	) {
		// TODO[준]: memberId가 closetClothesId의 소유자와 같은지 확인하는 로직 추가
		ClosetClothes closetClothes = closetClothesRepository.findById(closetClothesId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(ClosetClothesErrorCode.CLOSET_CLOTHES_NOT_FOUND));

		if (request.name() != null) {
			closetClothes.updateCustomName(request.name());
		}
		if (request.categoryId() != null) {
			Category category = categoryRepository.getReferenceById(request.categoryId());
			closetClothes.updateCustomCategory(category);
		}
		if (request.brandId() != null) {
			Brand brand = brandRepository.getReferenceById(request.brandId());
			closetClothes.updateCustomBrand(brand);
		}
		if (request.colorId() != null) {
			Color color = colorRepository.getReferenceById(request.colorId());
			closetClothes.updateCustomColor(color);
		}
		if (request.isPublic() != null) {
			closetClothes.updateIsPublic(request.isPublic());
		}

		return ClosetClothesDetailResponse.from(closetClothes);
	}

	@Transactional
	@Override
	public void removeClosetClothes(Long memberId, Long closetClothesId) {
		// TODO[준]: memberId가 closetClothesId의 소유자와 같은지 확인하는 로직 추가
		if (closetClothesRepository.existsById(closetClothesId)) {
			ExceptionUtil.throwException(ClosetClothesErrorCode.CLOSET_CLOTHES_NOT_FOUND);
		}

		closetClothesRepository.deleteById(closetClothesId);
	}

	@Transactional
	@Override
	public Long addLibraryClothesToCloset(Long clothesId, Long memberId) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));

		Closet closet = closetRepository.findByMemberId(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(ClosetErrorCode.CLOSET_NOT_FOUND));

		Clothes clothes = clothesRepository.findById(clothesId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(ClosetClothesErrorCode.CLOSET_CLOTHES_NOT_FOUND));

		if (closetClothesRepository.existsByClosetIdAndClothesId(closet.getId(), clothes.getId())) {
			ExceptionUtil.throwException(ClosetClothesErrorCode.CLOSET_CLOTHES_ALREADY_EXISTS);
		}

		ClosetClothes closetClothes = new ClosetClothes(closet, clothes);
		closetClothes.updateImgUrl(clothes.getImageUrl());
		closetClothes.updateIsPublic(true);
		return closetClothesRepository.save(closetClothes).getId();
	}

	@Transactional
	@Override
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
