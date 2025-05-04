package com.ssafy.sharedress.application.closet.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.application.closet.dto.ClosetClothesDetailResponse;
import com.ssafy.sharedress.application.closet.dto.ClosetClothesUpdateRequest;
import com.ssafy.sharedress.application.closet.usecase.ClosetClothesUseCase;
import com.ssafy.sharedress.domain.brand.entity.Brand;
import com.ssafy.sharedress.domain.brand.repository.BrandRepository;
import com.ssafy.sharedress.domain.category.entity.Category;
import com.ssafy.sharedress.domain.category.repository.CategoryRepository;
import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.closet.error.ClosetClothesErrorCode;
import com.ssafy.sharedress.domain.closet.repository.ClosetClothesRepository;
import com.ssafy.sharedress.domain.color.entity.Color;
import com.ssafy.sharedress.domain.color.repository.ColorRepository;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClosetClothesService implements ClosetClothesUseCase {

	private final CategoryRepository categoryRepository;
	private final ColorRepository colorRepository;
	private final BrandRepository brandRepository;
	private final ClosetClothesRepository closetClothesRepository;

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
		closetClothesRepository.deleteById(closetClothesId);
	}
}
