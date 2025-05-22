export const NavConfig: { [key: string]: boolean } = {
	'/wardrobe': true,
	'/social': true,
	'/mypage': true,
	'/friend': true,
	'/mypage/edit': false,
};

// 특정 경로의 네비게이션 바 표시 여부를 결정하는 함수
export const shouldShowNav = (pathname: string): boolean => {
	// 전체 경로가 NavConfig에 있는지 확인
	if (pathname in NavConfig) {
		return NavConfig[pathname];
	}

	// 첫 번째 뎁스 경로 추출
	const firstDepth = '/' + pathname.split('/')[1];

	// 첫 번째 뎁스 경로가 NavConfig에 있는지 확인
	return NavConfig[firstDepth] === true;
};
