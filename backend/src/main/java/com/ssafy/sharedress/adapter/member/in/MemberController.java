package com.ssafy.sharedress.adapter.member.in;

import java.util.List;

import org.hashids.Hashids;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.sharedress.application.guest.annotation.CurrentGuest;
import com.ssafy.sharedress.application.guest.usecase.GuestUseCase;
import com.ssafy.sharedress.application.member.annotation.CurrentMember;
import com.ssafy.sharedress.application.member.dto.DecodingOpenLinkResponse;
import com.ssafy.sharedress.application.member.dto.FcmTokenRequest;
import com.ssafy.sharedress.application.member.dto.MemberProfileResponse;
import com.ssafy.sharedress.application.member.dto.MemberSearchResponse;
import com.ssafy.sharedress.application.member.dto.MyProfileResponse;
import com.ssafy.sharedress.application.member.dto.PrivacyAgreeRequest;
import com.ssafy.sharedress.application.member.dto.PrivacyAgreeResponse;
import com.ssafy.sharedress.application.member.dto.UpdateNotificationStatusRequest;
import com.ssafy.sharedress.application.member.dto.UpdateProfileImageResponse;
import com.ssafy.sharedress.application.member.dto.UpdateProfileRequest;
import com.ssafy.sharedress.application.member.dto.UserProfileResponse;
import com.ssafy.sharedress.application.member.usecase.MemberQueryUseCase;
import com.ssafy.sharedress.application.member.usecase.MemberUseCase;
import com.ssafy.sharedress.domain.common.context.UserContext;
import com.ssafy.sharedress.domain.common.context.UserContextErrorCode;
import com.ssafy.sharedress.domain.guest.entity.Guest;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.global.dto.CursorPageResult;
import com.ssafy.sharedress.global.exception.ExceptionUtil;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MemberController {

	private final MemberQueryUseCase memberQueryUseCase;
	private final GuestUseCase guestUseCase;
	private final MemberUseCase memberUseCase;

	@GetMapping("/me")
	public ResponseEntity<ResponseWrapper<UserProfileResponse>> getMe(
		@CurrentMember(required = false) Member member,
		@CurrentGuest(required = false) Guest guest
	) {
		UserContext userContext = new UserContext(member, guest);
		UserProfileResponse response = null;
		if (userContext.isMember()) {
			response = UserProfileResponse.from(member);
		} else if (userContext.isGuest()) {
			response = UserProfileResponse.from(guest);
		} else {
			ExceptionUtil.throwException(UserContextErrorCode.USER_UNAUTHORIZED);
		}
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, response);
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
	public ResponseEntity<ResponseWrapper<MyProfileResponse>> getMyProfile(
		@CurrentMember Member member
	) {
		MyProfileResponse result = memberUseCase.getMyProfile(member.getId());
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, result);
	}

	@GetMapping("/members/{memberId}/profile")
	public ResponseEntity<ResponseWrapper<MemberProfileResponse>> getProfile(@PathVariable Long memberId) {
		MemberProfileResponse result = memberUseCase.getMemberProfile(memberId);
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, result);
	}

	@PatchMapping("/members/profile")
	public ResponseEntity<ResponseWrapper<MyProfileResponse>> updateMyProfile(
		@Valid @RequestBody UpdateProfileRequest request,
		@CurrentMember Member member
	) {
		MyProfileResponse result = memberUseCase.updateProfile(request, member.getId());
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, result);
	}

	@GetMapping("/open-link")
	public ResponseEntity<ResponseWrapper<String>> getOpenLink(@CurrentMember Member member) {
		String openLink = new Hashids("sharedress", 10).encode(member.getId());
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, openLink);
	}

	@GetMapping("/open-link/{hash}")
	public ResponseEntity<ResponseWrapper<DecodingOpenLinkResponse>> decodeHash(
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

		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, memberQueryUseCase.decodeOpenLink(hash));
	}

	@PatchMapping("/members/profile/notification")
	public ResponseEntity<ResponseWrapper<Void>> updateNotificationStatus(
		@RequestBody UpdateNotificationStatusRequest request,
		@CurrentMember Member member
	) {
		memberUseCase.updateNotificationStatus(request, member.getId());
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, null);
	}

	@PatchMapping("/members/profile/image")
	public ResponseEntity<ResponseWrapper<UpdateProfileImageResponse>> updateMyProfileImage(
		@RequestPart("profileImage") MultipartFile profileImage,
		@CurrentMember Member member
	) {
		UpdateProfileImageResponse result = memberUseCase.updateProfileImage(profileImage, member.getId());
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, result);
	}

	@PostMapping("/members/fcm-token")
	public ResponseEntity<ResponseWrapper<Void>> saveFcmToken(
		@RequestBody FcmTokenRequest request,
		@CurrentMember Member member
	) {
		memberUseCase.saveFcmToken(request, member.getId());
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, null);
	}

	@GetMapping("/members/privacy-agreement")
	public ResponseEntity<ResponseWrapper<PrivacyAgreeResponse>> getPrivacyAgreement(
		@CurrentMember Member member
	) {
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK,
			memberUseCase.getPrivacyAgreement(member.getId()));
	}

	@PatchMapping("/members/privacy-agreement")
	public ResponseEntity<ResponseWrapper<PrivacyAgreeResponse>> updatePrivacyAgreement(
		@CurrentMember Member member,
		@RequestBody PrivacyAgreeRequest request
	) {
		return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK,
			memberUseCase.updatePrivacyAgreement(member.getId(), request));
	}
}
