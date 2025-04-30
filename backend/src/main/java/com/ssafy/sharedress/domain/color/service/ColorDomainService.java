package com.ssafy.sharedress.domain.color.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sharedress.domain.color.entity.Color;
import com.ssafy.sharedress.domain.color.repository.ColorRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ColorDomainService {

	private final ColorRepository colorRepository;

	public List<Color> getAllColors() {
		return colorRepository.findAll();
	}
}
