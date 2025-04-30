package com.ssafy.sharedress.adapter.auth.out;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import com.ssafy.sharedress.application.auth.dto.GoogleUserInfoResponse;

@FeignClient(name = "googleUserInfoClient", url = "https://www.googleapis.com")
public interface GoogleUserInfoClient {

	@GetMapping(value = "/oauth2/v2/userinfo", produces = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	GoogleUserInfoResponse getUserInfo(@RequestHeader("Authorization") String accessToken);
}
