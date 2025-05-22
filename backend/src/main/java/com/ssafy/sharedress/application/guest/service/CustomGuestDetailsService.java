package com.ssafy.sharedress.application.guest.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ssafy.sharedress.application.guest.dto.CustomGuestDetails;
import com.ssafy.sharedress.domain.guest.entity.Guest;
import com.ssafy.sharedress.domain.guest.repository.GuestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomGuestDetailsService {

	private final GuestRepository guestRepository;

	public UserDetails loadUserByUsername(String uuid) throws UsernameNotFoundException {
		Optional<Guest> guest = guestRepository.findByUuid(uuid);
		return guest.map(CustomGuestDetails::new).orElse(null);
	}
}
