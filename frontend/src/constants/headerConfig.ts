export const headerConfig = {
	'/auth': {
		showBack: false,
		subtitle: '로그인',
		badgeText: '로그인 필요',
	},
	'/wardrobe': {
		showBack: true,
		subtitle: '내 옷장',
		badgeText: '전체',
	},
	'/notifications': {
		showBack: true,
		subtitle: '알림',
		badgeIcon: 'bell', // 아이콘만
	},
	'/social': {
		showBack: false,
		subtitle: '쉐어드레스',
		badgeIcon: 'bell', // 아이콘만
	},
} as const;
