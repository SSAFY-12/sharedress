package com.ssafy.sharedress.adapter.member.in;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.member.annotation.CurrentMember;
import com.ssafy.sharedress.application.member.dto.MemberSearchResponse;
import com.ssafy.sharedress.application.member.dto.MyProfileResponse;
import com.ssafy.sharedress.application.member.usecase.MemberQueryUseCase;
import com.ssafy.sharedress.application.member.usecase.MemberUseCase;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.global.dto.CursorPageResult;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MemberController {

	private final MemberQueryUseCase memberQueryUseCase;
	private final MemberUseCase memberUseCase;

	@GetMapping("/me")
	public ResponseEntity<ResponseWrapper<Member>> getMe(@CurrentMember Member member) {
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, member);
	}

	@GetMapping("/members/search")
	public ResponseEntity<ResponseWrapper<List<MemberSearchResponse>>> getMemberListByKeyword(
		@CurrentMember Member member,
		@RequestParam(required = false, defaultValue = "") String keyword,
		@RequestParam(required = false) Long cursor,
		@RequestParam(defaultValue = "20") int size
	) {
		Long memberId = member.getId();
		CursorPageResult<MemberSearchResponse> result = memberQueryUseCase.getMemberListByKeyword(
			memberId,
			keyword,
			cursor,
			size
		);

		return ResponseWrapperFactory.toPageResponseEntity(HttpStatus.OK, result);
	}

	// TODO[지윤] : @CurrentMember 어노테이션을 사용하여 로그인한 사용자의 정보를 가져오는 방법으로 변경
	@GetMapping("/members/profile/my")
	public ResponseEntity<ResponseWrapper<MyProfileResponse>> getMyProfile() {
		Long myId = 1L;
		MyProfileResponse result = memberUseCase.getMyProfile(myId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, result);
	}
}
