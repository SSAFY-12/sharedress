package com.ssafy.sharedress.application.guest.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ssafy.sharedress.application.guest.dto.CustomGuestDetails;
import com.ssafy.sharedress.domain.guest.entity.Guest;
import com.ssafy.sharedress.domain.guest.repository.GuestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomGuestDetailsService implements UserDetailsService {

	private final GuestRepository guestRepository;

	@Override
	public UserDetails loadUserByUsername(String guestId) throws UsernameNotFoundException {
		Optional<Guest> guest = guestRepository.findById(Long.valueOf(guestId));
		return guest.map(CustomGuestDetails::new).orElse(null);
	}
}
