import { PrimaryBtn } from '@/components/buttons/primary-button';
import { UserMiniAvatar } from '@/components/cards/user-mini-avatar';
import { SearchBar } from '@/components/inputs/search-bar';
import { FriendRequestMsgModal } from '@/features/social/components/FriendRequestMsgModal';
import { useState } from 'react';
import useSearchFriend from '@/features/social/hooks/useSearchFriend';
import useRequest from '@/features/social/hooks/useRequest';

export const FriendSearchResultPage = () => {
	const [searchValue, setSearchValue] = useState(''); // 실시간으로 바뀌는 내용
	// enter 이벤트를 걸었을때 담길 resultValue
	const [resultValue, setResultValue] = useState('돈까스 현래'); // useEffect로 거는게 아니라 enter 이벤트에 따라 발생하도록
	// useEffectHook이 resultValue가 바뀔떄마다 실행되어야 함!!!
	const [modalOpen, setModalOpen] = useState(false); // 모달 열기
	const [selectedFriend, setSelectedFriend] = useState<{
		// 선택된 친구 => 해당 친구를 기준으로 모달 열어줌
		profileImage: string;
		nickname: string;
		id: number; //친구 고유 아이디
		// code: string; // 닉네임 중복방지
		// oneLiner: string; //한줄 소개
	} | null>(null); // 선택된 친구가 있거나 없거나

	// const { searchAllFriend, isLoadingAllFriend, errorAllFriend } =
	const { searchAllFriend } = useSearchFriend(resultValue); // 검색 결과 목록 영역에 데이터 반환 -> 그럼 이게 resultValue가 변경될때마다 반영이 되는 것인지?
	// const { requestFriend, isRequesting, requestError, isRequestSuccess } =
	const { requestFriend } = useRequest(); // 친구 요청 버튼 로직

	// Enter이벤트 발생시 -> searchAllFriend에 친구리스트 목록이 나올 것
	const handleSearch = (e: any) => {
		if (e.key === 'Enter') {
			// 엔터 이벤트 처리
			e.preventDefault(); // 이것 why?
			// 근데 그렇다면 searchBar의 진정한 역할은 무엇일까? 그냥 data를 담아주는 용도? inputTag를 깔끔하게 보여주는 공통 컴포넌트의 그 역할에 그친것?
			setResultValue(resultValue); // 검색 결과 목록 영역에 데이터 반환 => 이것을 get으로 전달해서 get으로 데이터 받아옴
			// 검색 로직 구현
		}
	};

	// 친구 신청 메세지 제출
	const handleSubmit = (msg: string) => {
		if (selectedFriend) {
			requestFriend({
				receiverId: selectedFriend.id,
				message: msg,
			});
		}
		setModalOpen(false); // 모달 닫기
	};

	return (
		<div className='flex flex-col h-full max-w-md mx-auto bg-white'>
			{/* 검색 영역 */}
			<div className='px-4 py-3'>
				<SearchBar
					placeholder='친구 ID'
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					onKeyDown={handleSearch} // 엔터 이벤트 처리
					onSubmit={handleSearch} // 검색 이벤트 처리
				/>
			</div>

			{resultValue === '' ? (
				<div>
					<span>검색 결과가 없습니다.</span>
				</div>
			) : (
				<div className='flex-1 p-4'>
					{/* 검색 결과 목록 영역 === 제출한 값이 있다면 */}
					{searchAllFriend &&
						searchAllFriend.length > 0 &&
						searchAllFriend.map((friend) => (
							<div
								className='border rounded-lg p-6 flex flex-col items-center'
								key={friend.id}
							>
								<UserMiniAvatar
									// src='https://picsum.photos/200/300?random=1'
									src={friend.profileImage}
									size='lg'
									className='mb-3'
								/>
								{/* <h2 className='font-bold mb-1'>돈까스현래</h2> */}
								<h2 className='font-bold mb-1'>{friend.nickname}</h2>
								{/* 서버에서 받아온 data */}

								{/* 친구 유무에 따른 name 변경 => 친구 신청 / 친구 요청 취소 */}
								<PrimaryBtn
									size='compact'
									name='친구 신청'
									color='black'
									// 친구 신청 요청 모달 열기
									onClick={() => {
										setModalOpen(true); // 모달 열기
										setSelectedFriend(friend); // 선택된 친구 데이터 저장
									}} //친구 신청 요청 -> api 연동
									className='mt-3'
								/>
							</div>
						))}
				</div>
			)}
			{/* 친구 정보가 담기게 된다면? -> 모달 열기 */}
			{selectedFriend && (
				<FriendRequestMsgModal
					isOpen={modalOpen}
					onClose={() => setModalOpen(false)} // 모달 닫기
					friend={selectedFriend} // 선택된 친구 데이터 전달
					// 제출시 mutation 요청 : 친구 아이디와 메시지 전달
					onSubmit={handleSubmit}
				/>
			)}
		</div>
	);
};
