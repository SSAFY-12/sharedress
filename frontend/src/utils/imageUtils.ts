// 구글 로그인(프로필 이미지 최적화)
export const getOptimizedImageUrl = (url: string | null | undefined) => {
	if (!url) return '/default-profile.png'; // 이미지가 없는 경우 기본 이미지 반환(프로젝트에서 만든 기본 프로필 이미지)

	// Google 프로필 이미지인 경우 크기 최적화(공식적인 최적화 방식)
	// 구글 프로필 이미지 URL 구조 ===  https://lh3.googleusercontent.com/a/[사용자ID]=s[크기]-c
	// 구글 이미지 호스팅 서버

	if (url.includes('googleusercontent.com')) {
		// 이미 최적화된 URL인지 확인
		if (url.includes('=s96-c')) return url; // 이미 최적화된 URL인 경우 그대로 반환
		// s[크기]-c : 이미지 크기 파라미터 : s96 : 96*96 픽셀 크기, -c : 정사각형으로 자르는 옵션
		return `${url}=s96-c`; // 최적화된 URL로 변환(원본 이미지 크기 줄여서, 리사이즈)
	}

	return url;
};
