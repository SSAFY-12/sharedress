import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// [ProfileState 인터페이스]
// - 내 프로필 정보 및 관련 setter/getter 함수 정의
interface ProfileState {
	myId: number | null; // 내 유저 ID
	nickname: string | null; // 닉네임
	oneLiner: string | null; // 한 줄 소개
	isPublic: boolean | undefined; // 프로필 공개 여부
	setMyId: (myId: number) => void; // 내 ID 설정
	getMyId: () => number | null; // 내 ID 반환
	setIsPublic: (isPublic: boolean) => void; // 공개 여부 설정
	getIsPublic: () => boolean | undefined; // 공개 여부 반환
	setNickname: (nickname: string) => void; // 닉네임 설정
	setOneLiner: (oneLiner: string) => void; // 한 줄 소개 설정
}

// [useProfileStore]
// - zustand + persist로 프로필 상태를 전역/로컬스토리지에 저장
export const useProfileStore = create<ProfileState>()(
	persist(
		(set, get) => ({
			myId: null, // 내 유저 ID (초기값 null)
			nickname: null, // 닉네임 (초기값 null)
			oneLiner: null, // 한 줄 소개 (초기값 null)
			setMyId: (myId) => set({ myId }), // 내 ID 설정
			getMyId: () => get().myId, // 내 ID 반환
			isPublic: undefined, // 공개 여부 (초기값 undefined)
			setIsPublic: (isPublic) => set({ isPublic }), // 공개 여부 설정
			getIsPublic: () => get().isPublic, // 공개 여부 반환
			setNickname: (nickname) => set({ nickname }), // 닉네임 설정
			setOneLiner: (oneLiner) => set({ oneLiner }), // 한 줄 소개 설정
		}),

		{
			name: 'profile-storage', // localStorage에 저장될 key
		},
	),
);
