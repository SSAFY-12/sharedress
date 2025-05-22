package com.ssafy.sharedress.global.util;

import java.util.List;
import java.util.Random;

public class NicknameGenerator {

	private static final List<String> ADJECTIVES = List.of(
		"귀여운", "화려한", "빛나는", "신비로운", "용감한",
		"달콤한", "빠른", "우아한", "멋진", "행복한"
	);

	private static final List<String> NOUNS = List.of(
		"꽃사슴", "고양이", "호랑이", "나비", "펭귄",
		"돌고래", "부엉이", "사자", "강아지", "코끼리"
	);

	private static final Random random = new Random();

	public static String generate() {
		String adjective = ADJECTIVES.get(random.nextInt(ADJECTIVES.size()));
		String noun = NOUNS.get(random.nextInt(NOUNS.size()));
		return adjective + " " + noun;
	}
}
