export interface FriendList {
	//친구 리스트
	content: {
		id: number; //친구 고유 아이디
		nickname: string; //닉네임
		profileImage: string; //프로필 이미지
		oneLiner: string; //한줄 소개
	}[]; //배열 리스트 === 친구 목록
}

export interface SearchFriend {
	// 친구 검색
	comments: {
		id: number; //친구 고유 아이디
		nickname: string; //닉네임
		profileImage: string; //프로필 이미지
		oneLiner: string; //한줄 소개
		isFriend: boolean; //친구 관계 여부
		isRequestPending: boolean; //친구 요청 여부
	}[]; //여러명의 친구 검색 결과
}

export interface FriendRequest {
	// 친구 요청
	receiverId: number; //받는 사람 고유 아이디
	message: string; //메시지
}

export interface AcceptFriendRequest {
	// 친구 요청 수락
	requestId: number; //친구 요청 고유 아이디
}

export interface RejectFriendRequest {
	// 친구 요청 거절
	requestId: number; //친구 요청 고유 아이디
}
