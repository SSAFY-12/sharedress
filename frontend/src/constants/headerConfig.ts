export const headerConfig = {
	'/auth': {
		showBack: false,
		subtitle: '로그인',
		badgeText: '로그인 필요',
	},
	'/wardrobe': {
		showBack: true,
		subtitle: '내 옷장',
		// badgeIcon: 'success', // 아이콘만
		badgeText: '전체',
	},
	'/notifications': {
		showBack: true,
		subtitle: '알림',
		badgeIcon: 'bell', // 아이콘만
	},
	'/regist': {
		showBack: true,
		subtitle: '옷 등록하기',
		badgeText: '',
	},

	'/regist/scan': {
		showBack: true,
		subtitle: '구매내역 스캔',
		badgeText: '', // 추후에 설정 필요
	},
	'/regist/search': {
		showBack: true,
		subtitle: '옷 검색하기',
		badgeText: '', // 추후에 설정 필요
	},
	'/regist/camera': {
		showBack: true,
		subtitle: '사진으로 등록',
		badgeText: '',
	},
} as const;
