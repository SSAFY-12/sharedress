package com.ssafy.sharedress.adapter.member.in;

import java.util.List;

import org.hashids.Hashids;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.guest.annotation.CurrentGuest;
import com.ssafy.sharedress.application.guest.usecase.GuestUseCase;
import com.ssafy.sharedress.application.member.annotation.CurrentMember;
import com.ssafy.sharedress.application.member.dto.MemberSearchResponse;
import com.ssafy.sharedress.application.member.usecase.MemberQueryUseCase;
import com.ssafy.sharedress.domain.guest.entity.Guest;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.global.dto.CursorPageResult;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MemberController {

	private final MemberQueryUseCase memberQueryUseCase;
	private final GuestUseCase guestUseCase;

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

	@GetMapping("/open-link")
	public ResponseEntity<ResponseWrapper<String>> getOpenLink(@CurrentMember Member member) {
		String openLink = new Hashids("sharedress", 10).encode(member.getId());
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, openLink);
	}

	@GetMapping("/open-link/{hash}")
	public ResponseEntity<ResponseWrapper<Long>> decodeHash(
		HttpServletResponse response,
		@CurrentMember(required = false) Member member,
		@CurrentGuest(required = false) Guest guest,
		@PathVariable("hash") String hash
	) {
		if (member == null && guest == null) {
			String token = guestUseCase.createGuest();

			Cookie cookie = new Cookie("guestToken", token);
			cookie.setPath("/");
			cookie.setHttpOnly(true);
			response.addCookie(cookie);
		}

		Long memberId = new Hashids("sharedress", 10).decode(hash)[0];
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, memberId);
	}
}
