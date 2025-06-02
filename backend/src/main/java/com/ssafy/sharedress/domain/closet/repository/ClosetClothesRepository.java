package com.ssafy.sharedress.domain.closet.repository;

import java.util.List;
import java.util.Optional;

import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.global.dto.CursorPageResult;

public interface ClosetClothesRepository {
	CursorPageResult<ClosetClothes> findByMemberAndCategoryWithCursor(
		Long memberId,
		Long categoryId,
		Long cursorId,
		int size,
		boolean isMe
	);

	ClosetClothes save(ClosetClothes closetClothes);

	ClosetClothes getReferenceById(Long id);

	Optional<ClosetClothes> findByIdAndImgNotNull(Long id);

	Optional<ClosetClothes> findById(Long id);

	boolean existsByClosetIdAndClothesId(Long closetId, Long clothesId);

	void deleteById(Long closetClothesId);

	Boolean existsByIdAndMemberId(Long closetClothesId, Long memberId);

	List<ClosetClothes> findAllByClothesIds(List<Long> clothesIds);

	List<ClosetClothes> findAllByMemberId(Long myId);

	List<ClosetClothes> findAllByIds(List<Long> closetClothesIds);

	void deleteAllByCloset_Id(Long closetId);

	void delete(ClosetClothes closetClothes);

	Optional<ClosetClothes> findByClosetIdAndClothesId(Long closetId, Long clothesId);
}
