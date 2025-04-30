export const headerConfig = {
	'/auth': {
		showBack: false,
		subtitle: '로그인',
		badgeType: 'info' as const,
		badgeText: '로그인 필요',
	},
	'/wardrobe': {
		showBack: true,
		subtitle: '내 옷장',
		badgeType: 'success' as const,
		badgeText: '전체',
	},
	'/codi': {
		showBack: true,
		subtitle: '코디',
		badgeType: 'warning' as const,
		badgeText: '새 코디',
	},
} as const;
