export interface FcmToken {
	//FCM 토큰 타입
	fcmToken: string;
}

export interface FcmTokenReq {
	//사용자 FCM 토큰 저장
	fcmToken: string;
}

export interface NotificationListRes {
	//알림 목록 조회 응답 타입
	status: {
		code: string;
		message: string;
	};
	content: {
		id: number;
		notificationType: number;
		title: string; // 알림 제목
		body: string; // 알림 내용
		isRead: boolean; // 알림 읽음 여부
		requester: {
			id: number; // 요청자 아이디
			email: string; // 요청자 이메일
			nickname: string; // 요청자 닉네임
			code: string; // 요청자 코드
			profileImage: string; // 요청자 프로필 이미지
			oneLiner: string; // 요청자 한줄 소개
			isGuest: boolean; // 요청자 게스트 여부
		};
		createdAt: string; // 알림 생성 시간
	}[];
}

export interface NotificationLeadReq {
	//알림 리더 요청 타입
	notificationId: number;
}

export interface NotificationLeadRes {
	//알림 리더 응답 타입
	status: {
		code: string;
		message: string;
	};
	content: {
		id: number; // 알림 아이디
		isRead: boolean; // 알림 읽음 여부
		isFirstRead: boolean; // 알림 첫 읽음 여부
	};
}
