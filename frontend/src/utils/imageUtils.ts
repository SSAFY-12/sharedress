export const getOptimizedImageUrl = (url: string | null | undefined) => {
	if (!url) return '/default-profile.png';

	// Google 프로필 이미지인 경우 크기 최적화
	if (url.includes('googleusercontent.com')) {
		// 이미 최적화된 URL인지 확인
		if (url.includes('=s96-c')) return url;
		return `${url}=s96-c`;
	}

	return url;
};
