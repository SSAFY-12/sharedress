export const headerConfig = {
	'/auth': {
		showBack: false,
		subtitle: '로그인',
		badgeText: '로그인 필요', // 텍스트만
	},
	'/wardrobe': {
		showBack: true,
		subtitle: '내 옷장',
		// badgeIcon: 'success', // 아이콘만
		badgeText: '전체', // 텍스트도 함께
	},
	'/notifications': {
		showBack: true,
		subtitle: '알림',
		badgeIcon: 'bell', // 아이콘만
	},
} as const;
