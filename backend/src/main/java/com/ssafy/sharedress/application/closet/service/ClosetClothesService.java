package com.ssafy.sharedress.application.closet.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.sharedress.adapter.clothes.out.messaging.SqsMessageSender;
import com.ssafy.sharedress.application.ai.dto.AiTaskResponse;
import com.ssafy.sharedress.application.closet.dto.ClosetClothesDetailResponse;
import com.ssafy.sharedress.application.closet.dto.ClosetClothesUpdateRequest;
import com.ssafy.sharedress.application.closet.usecase.ClosetClothesUseCase;
import com.ssafy.sharedress.application.clothes.dto.AiProcessMessagePhotoRequest;
import com.ssafy.sharedress.application.clothes.dto.AiProcessMessagePurchaseRequest;
import com.ssafy.sharedress.application.clothes.dto.ClothesPhotoDetailRequest;
import com.ssafy.sharedress.application.clothes.dto.ClothesPhotoDetailResponse;
import com.ssafy.sharedress.application.clothes.dto.ClothesPhotoUploadResponse;
import com.ssafy.sharedress.application.clothes.dto.PurchaseHistoryRequest;
import com.ssafy.sharedress.domain.admin.entity.Admin;
import com.ssafy.sharedress.domain.admin.entity.AdminPhoto;
import com.ssafy.sharedress.domain.admin.repository.AdminPhotoRepository;
import com.ssafy.sharedress.domain.admin.repository.AdminRepository;
import com.ssafy.sharedress.domain.ai.entity.AiTask;
import com.ssafy.sharedress.domain.ai.entity.TaskType;
import com.ssafy.sharedress.domain.ai.repository.AiTaskRepository;
import com.ssafy.sharedress.domain.brand.entity.Brand;
import com.ssafy.sharedress.domain.brand.error.BrandErrorCode;
import com.ssafy.sharedress.domain.brand.repository.BrandRepository;
import com.ssafy.sharedress.domain.category.entity.Category;
import com.ssafy.sharedress.domain.category.error.CategoryErrorCode;
import com.ssafy.sharedress.domain.category.repository.CategoryRepository;
import com.ssafy.sharedress.domain.closet.entity.Closet;
import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.closet.error.ClosetClothesErrorCode;
import com.ssafy.sharedress.domain.closet.error.ClosetErrorCode;
import com.ssafy.sharedress.domain.closet.repository.ClosetClothesRepository;
import com.ssafy.sharedress.domain.closet.repository.ClosetRepository;
import com.ssafy.sharedress.domain.clothes.entity.Clothes;
import com.ssafy.sharedress.domain.clothes.entity.PhotoUploadLog;
import com.ssafy.sharedress.domain.clothes.error.ClothesErrorCode;
import com.ssafy.sharedress.domain.clothes.repository.ClothesRepository;
import com.ssafy.sharedress.domain.clothes.repository.PhotoUploadLogRepository;
import com.ssafy.sharedress.domain.color.entity.Color;
import com.ssafy.sharedress.domain.color.error.ColorErrorCode;
import com.ssafy.sharedress.domain.color.repository.ColorRepository;
import com.ssafy.sharedress.domain.common.port.ImageStoragePort;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.error.MemberErrorCode;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;
import com.ssafy.sharedress.domain.shoppingmall.entity.ShoppingMall;
import com.ssafy.sharedress.domain.shoppingmall.error.ShoppingMallErrorCode;
import com.ssafy.sharedress.domain.shoppingmall.repository.ShoppingMallRepository;
import com.ssafy.sharedress.global.exception.ExceptionUtil;
import com.ssafy.sharedress.global.util.RegexUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClosetClothesService implements ClosetClothesUseCase {

	@Value("${cloud.aws.s3.path.photo}")
	private String photoPath;

	private final CategoryRepository categoryRepository;
	private final ColorRepository colorRepository;
	private final BrandRepository brandRepository;
	private final ClosetClothesRepository closetClothesRepository;
	private final MemberRepository memberRepository;
	private final ClosetRepository closetRepository;
	private final ClothesRepository clothesRepository;
	private final ShoppingMallRepository shoppingMallRepository;
	private final AiTaskRepository aiTaskRepository;
	private final PhotoUploadLogRepository photoUploadLogRepository;
	private final AdminRepository adminRepository;
	private final AdminPhotoRepository adminPhotoRepository;

	private final SqsMessageSender sqsMessageSender;
	private final ImageStoragePort imageStoragePort;

	private static final int MAX_ITEMS_PER_MESSAGE = 30;

	@Transactional
	@Override
	public ClosetClothesDetailResponse updateClosetClothes(
		Long memberId,
		Long closetClothesId,
		ClosetClothesUpdateRequest request
	) {
		if (!closetClothesRepository.existsByIdAndMemberId(closetClothesId, memberId)) {
			ExceptionUtil.throwException(ClosetClothesErrorCode.CLOSET_CLOTHES_NOT_BELONG_TO_MEMBER);
		}

		ClosetClothes closetClothes = closetClothesRepository.findByIdAndImgNotNull(closetClothesId)
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
		if (!closetClothesRepository.existsByIdAndMemberId(closetClothesId, memberId)) {
			ExceptionUtil.throwException(ClosetClothesErrorCode.CLOSET_CLOTHES_NOT_BELONG_TO_MEMBER);
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

		log.info("clothesId={}", clothesId);
		Clothes clothes = clothesRepository.findById(clothesId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(ClothesErrorCode.CLOTHES_NOT_FOUND));

		if (closetClothesRepository.existsByClosetIdAndClothesId(closet.getId(), clothes.getId())) {
			ExceptionUtil.throwException(ClosetClothesErrorCode.CLOSET_CLOTHES_ALREADY_EXISTS);
		}

		ClosetClothes closetClothes = new ClosetClothes(closet, clothes);
		closetClothes.updateImgUrl(clothes.getImageUrl());
		return closetClothesRepository.save(closetClothes).getId();
	}

	@Transactional
	@Override
	public AiTaskResponse registerClothesFromPurchase(PurchaseHistoryRequest request, Long memberId) {
		Member member = memberRepository
			.findById(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));

		ShoppingMall shoppingMall = shoppingMallRepository.findById(request.shopId())
			.orElseThrow(ExceptionUtil.exceptionSupplier(ShoppingMallErrorCode.SHOPPING_MALL_NOT_FOUND));

		Closet closet = closetRepository.findByMemberId(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(ClosetErrorCode.CLOSET_NOT_FOUND));

		String taskId = UUID.randomUUID().toString();
		AiTask aiTask = new AiTask(taskId, false, member, shoppingMall, TaskType.PURCHASE_HISTORY);

		List<AiProcessMessagePurchaseRequest.ItemInfo> itemsToProcess = new ArrayList<>();

		// TODO[지윤]: 시연시나리오용 memberId==146 에 대한 분기처리
		// 구매내역을 가지고 요청한 146 은 aiTask 생성, admin 생성 후 return
		if (memberId == 140L) {
			List<Long> clothesIds = List.of(
				// 시연용 옷 ID 목록
				1L, 2L, 3L, 4L, 5L, 6L, 7L, 8L, 9L, 10L
			);

			clothesIds.forEach(id -> {
				clothesRepository.findById(id)
					.ifPresent(clothes -> {
						Admin admin = new Admin(member, taskId, clothes);
						adminRepository.save(admin);
					});
			});
			return AiTaskResponse.from(aiTaskRepository.save(aiTask), request.shopId());
		}

		request.items()
			.stream()
			.sorted((a, b) -> -1)
			.forEach(item -> {

				// 상품명 필수 체크
				if (item.name() == null || item.name().isBlank()) {
					log.warn("상품명이 비어있어 등록에서 제외됨: item={}", item);
					return;
				}

				// 브랜드 조회 또는 저장
				Brand brand = brandRepository.findByExactNameEnOrKr(item.brandNameEng(), item.brandNameKor())
					.orElseGet(() -> brandRepository.save(new Brand(item.brandNameEng(), item.brandNameKor())));

				String normalizedName = RegexUtils.normalizeProductName(item.name());

				Category category = categoryRepository.getReferenceById(-1L);
				Color color = colorRepository.getReferenceById(-1L);

				// 라이브러리 조회 (상품명 + 브랜드 ID 기준)
				Optional<Clothes> existing = clothesRepository.findByNameAndBrandId(normalizedName, brand.getId());

				// Clothes 객체 (있으면 재사용, 없으면 생성 및 저장)
				Clothes clothes = existing.orElseGet(() ->
					clothesRepository.save(
						Clothes.createByShoppingMall(
							normalizedName,
							item.linkUrl(),
							brand,
							color,
							category,
							shoppingMall
						)
					)
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
					itemsToProcess.add(new AiProcessMessagePurchaseRequest.ItemInfo(clothes.getId(), item.linkUrl()));
					log.info("AI 처리 요청 발행됨: clothesId={}, memberId={}", clothes.getId(), memberId);
				}

				// 내 옷장에 등록
				ClosetClothes closetClothes = new ClosetClothes(closet, clothes);
				if (existing.isPresent()) {
					closetClothes.updateImgUrl(clothes.getImageUrl());
				}
				closetClothesRepository.save(closetClothes);
				log.info("내 옷장 등록 완료: clothesId={}, closetId={}", clothes.getId(), closet.getId());
			});

		if (!itemsToProcess.isEmpty()) {
			List<List<AiProcessMessagePurchaseRequest.ItemInfo>> batches = batchList(itemsToProcess,
				MAX_ITEMS_PER_MESSAGE);

			for (int i = 0; i < batches.size(); i++) {
				List<AiProcessMessagePurchaseRequest.ItemInfo> batch = batches.get(i);
				boolean isLast = (i == batches.size() - 1);

				AiProcessMessagePurchaseRequest message = new AiProcessMessagePurchaseRequest(
					taskId,
					isLast,
					memberId,
					member.getFcmToken(),
					batch
				);

				try {
					sqsMessageSender.send(message);
					log.debug("SQS 전송 성공: taskId={}, isLast={}, batchSize={}", taskId, isLast, batch.size());
				} catch (Exception e) {
					log.error("SQS 전송 중 예외 발생: {}", e.getMessage(), e);
					throw new RuntimeException("메시지 전송 실패", e);
				}
			}
			log.info("SQS 메시지 전송 완료: taskId={}, 총 배치 수={}, 총 아이템 수={}", taskId, batches.size(), itemsToProcess.size());
		} else {
			aiTask.updateCompleted();
		}
		return AiTaskResponse.from(aiTaskRepository.save(aiTask), request.shopId());
	}

	@Transactional
	@Override
	public List<ClothesPhotoUploadResponse> uploadClosetClothesPhotos(Long memberId, List<MultipartFile> photos) {
		List<String> s3urls = imageStoragePort.upload(photoPath, photos);

		Closet closet = closetRepository.findByMemberId(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(ClosetErrorCode.CLOSET_NOT_FOUND));

		List<ClothesPhotoUploadResponse> result = new ArrayList<>();

		for (String url : s3urls) {
			Clothes clothes = clothesRepository.save(
				Clothes.createByPhoto(
					url,
					brandRepository.getReferenceById(-1L),
					colorRepository.getReferenceById(-1L),
					categoryRepository.getReferenceById(-1L),
					shoppingMallRepository.getReferenceById(-1L)
				)
			);

			ClosetClothes closetClothes = closetClothesRepository.save(new ClosetClothes(closet, clothes));

			// For test
			if (memberId == 140L) {
				adminPhotoRepository.save(
					new AdminPhoto(
						memberRepository.getReferenceById(memberId),
						null,
						closetClothes
					));
			}

			result.add(ClothesPhotoUploadResponse.from(closetClothes, url));
		}
		return result;
	}

	@Transactional
	@Override
	public ClothesPhotoDetailResponse registerClothesFromPhotos(
		Long memberId,
		List<ClothesPhotoDetailRequest> request
	) {

		Member member = memberRepository.findById(memberId)
			.orElseThrow(ExceptionUtil.exceptionSupplier(MemberErrorCode.MEMBER_NOT_FOUND));

		String taskId = UUID.randomUUID().toString();
		AiTask aiTask = new AiTask(
			taskId,
			false,
			member,
			shoppingMallRepository.getReferenceById(-1L),
			TaskType.PHOTO
		);

		// for test
		if (memberId == 140L) {
			List<AdminPhoto> adminPhotos = adminPhotoRepository.findAllByMemberId(memberId);
			adminPhotos.forEach(adminPhoto -> adminPhoto.updateTaskId(taskId));

			for (int i = 0; i < request.size(); i++) {
				AdminPhoto adminPhoto = adminPhotos.get(i);
				ClosetClothes closetClothes = adminPhoto.getClosetClothes();
				ClothesPhotoDetailRequest req = request.get(i);

				closetClothes.updateCustomBrand(
					brandRepository.findById(req.brandId())
						.orElseThrow(ExceptionUtil.exceptionSupplier(BrandErrorCode.BRAND_NOT_FOUND))
				);
				closetClothes.updateCustomCategory(
					categoryRepository.findById(req.categoryId())
						.orElseThrow(ExceptionUtil.exceptionSupplier(CategoryErrorCode.CATEGORY_NOT_FOUND))
				);
				closetClothes.updateCustomColor(
					colorRepository.findById(req.colorId())
						.orElseThrow(ExceptionUtil.exceptionSupplier(ColorErrorCode.COLOR_NOT_FOUND))
				);
				closetClothes.updateCustomName(req.name());
				closetClothes.updateIsPublic(req.isPublic());

				// TODO: log 필요하면 추가할 것
			}
			return ClothesPhotoDetailResponse.from(
				aiTaskRepository.save(aiTask)
			);
		}

		List<AiProcessMessagePhotoRequest.ItemInfo> itemsToProcess = new ArrayList<>();

		for (ClothesPhotoDetailRequest req : request) {
			ClosetClothes closetClothes = closetClothesRepository.findById(req.id())
				.orElseThrow(ExceptionUtil.exceptionSupplier(ClosetClothesErrorCode.CLOSET_CLOTHES_NOT_FOUND));

			closetClothes.updateCustomBrand(
				brandRepository.findById(req.brandId())
					.orElseThrow(ExceptionUtil.exceptionSupplier(BrandErrorCode.BRAND_NOT_FOUND))
			);
			closetClothes.updateCustomCategory(
				categoryRepository.findById(req.categoryId())
					.orElseThrow(ExceptionUtil.exceptionSupplier(CategoryErrorCode.CATEGORY_NOT_FOUND))
			);
			closetClothes.updateCustomColor(
				colorRepository.findById(req.colorId())
					.orElseThrow(ExceptionUtil.exceptionSupplier(ColorErrorCode.COLOR_NOT_FOUND))
			);
			closetClothes.updateCustomName(req.name());
			closetClothes.updateIsPublic(req.isPublic());

			photoUploadLogRepository.save(new PhotoUploadLog(member));

			itemsToProcess.add(
				new AiProcessMessagePhotoRequest.ItemInfo(
					closetClothes.getId(),
					closetClothes.getClothes().getGoodsLinkUrl(),
					req.categoryId()
				)
			);
		}

		try {
			sqsMessageSender.send(
				new AiProcessMessagePhotoRequest(taskId, memberId, itemsToProcess)
			);
			log.debug("SQS 전송 성공: taskId={}", taskId);
		} catch (Exception e) {
			log.error("SQS 전송 중 예외 발생: {}", e.getMessage(), e);
			throw new RuntimeException("메시지 전송 실패", e);
		}

		return ClothesPhotoDetailResponse.from(
			aiTaskRepository.save(aiTask)
		);
	}

	private static <T> List<List<T>> batchList(List<T> list, int batchSize) {
		List<List<T>> batches = new ArrayList<>();
		for (int i = 0; i < list.size(); i += batchSize) {
			int endIndex = Math.min(i + batchSize, list.size());
			batches.add(list.subList(i, endIndex));
		}
		return batches;
	}

}
