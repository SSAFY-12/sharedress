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
	'/notification': {
		showBack: true,
		subtitle: '알림',
	},

	'/social/add': {
		showBack: true,
		subtitle: '친구 ID로 추가',
		// badgeText: '확인',
	},
	'/social/request': {
		showBack: true,
		subtitle: '친구 요청 목록',
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
	'/cloth/:id': {
		showBack: true,
	},
	'/codi/:id': {
		showBack: true,
	},
	'/social/codi-request': {
		showBack: true,
		subtitle: '친구에게 조언 받기',
	},
} as const;
