package com.ssafy.sharedress.global.util;

public class RegexUtils {
	private RegexUtils() {
		throw new UnsupportedOperationException("Utility class");
	}

	public static String normalizeProductName(String name) {
		if (name == null) {
			return null;
		}
		while (name.matches("^\\s*(\\[[^\\]]*\\]|\\([^)]*\\))\\s*.*")) {
			name = name.replaceFirst("^\\s*(\\[[^\\]]*\\]|\\([^)]*\\))\\s*", "");
		}
		return name.trim();
	}
}
