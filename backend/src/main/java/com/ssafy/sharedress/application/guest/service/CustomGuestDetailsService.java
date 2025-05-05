package com.ssafy.sharedress.application.guest.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ssafy.sharedress.application.guest.dto.CustomGuestDetails;
import com.ssafy.sharedress.domain.guest.entity.Guest;
import com.ssafy.sharedress.domain.guest.error.GuestErrorCode;
import com.ssafy.sharedress.domain.guest.repository.GuestRepository;
import com.ssafy.sharedress.global.exception.ExceptionUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomGuestDetailsService implements UserDetailsService {

	private final GuestRepository guestRepository;

	@Override
	public UserDetails loadUserByUsername(String guestId) throws UsernameNotFoundException {
		Guest guest = guestRepository.findById(Long.valueOf(guestId))
			.orElseThrow(ExceptionUtil.exceptionSupplier(GuestErrorCode.GUEST_NOT_FOUND));
		return new CustomGuestDetails(guest);
	}
}
