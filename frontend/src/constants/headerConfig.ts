import { HeaderProps } from '@/components/layouts/Header';

type HeaderConfig = {
	[key: string]: Partial<HeaderProps>;
};

export const headerConfig: HeaderConfig = {
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
		badgeIcon: 'bell',
	},

	'/social/add': {
		showBack: true,
		subtitle: '친구 ID로 추가',
		badgeText: '확인',
	},
	'/social/request': {
		showBack: true,
		subtitle: '친구 요청 목록',
	},
};
