import { PrimaryBtn } from '@/components/buttons/primary-button';
import { UserMiniAvatar } from '@/components/cards/user-mini-avatar';
import { SearchBar } from '@/components/inputs/search-bar';
import { FriendRequestMsgModal } from '@/features/social/components/FriendRequestMsgModal';
import React, { useState, useRef, useCallback } from 'react';
import useRequest from '@/features/social/hooks/useRequest';
import useSearchUser from '@/features/social/hooks/useSearchUser';
import { RelationStatus } from '@/features/social/types/social';

export const FriendSearchResultPage = () => {
	const [searchValue, setSearchValue] = useState('');
	const [resultValue, setResultValue] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState<{
		profileImage: string;
		nickname: string;
		id: number;
		relationStatus: RelationStatus;
	} | null>(null);

	const { searchUsers, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useSearchUser(resultValue); // 검색 결과 목록 영역(무한 스크롤 구현)
	const { requestFriend, cancelRequest, acceptRequest } = useRequest(); // 친구 요청 전송/취소 버튼 로직

	// Intersection Observer를 위한 ref
	const observerRef = useRef<IntersectionObserver | null>(null); // IntersectionObserver 객체 저장
	// 웹 브라우저에서 제공하는 API, 특정 요소가 화면에 보이는지 감지할 수 있게 해주는 기능

	// 마지막 요소를 관찰
	const lastElementRef = useCallback(
		// 불필요한 재생성 방지를 위해 함수 메모이제이션
		(node: HTMLDivElement | null) => {
			// 마지막 요소를 관찰하는 ref, node === 관찰할 HTML
			if (isFetchingNextPage) return; // 데이터 로딩 중이면 관찰 중단
			// 다음 페이지를 불러오면 관찰 중단

			// 이전 observer가 있다면 연결 해제
			if (observerRef.current) {
				observerRef.current.disconnect();
			}

			// 새로운 observer 생성
			observerRef.current = new IntersectionObserver((entries) => {
				// 첫 번째 요소가 화면에 보이고 있는지 확인 && 다음 페이지가 있는지 여부
				if (entries[0].isIntersecting && hasNextPage) {
					fetchNextPage(); // 다음 페이지 로드
				}
			});

			// 마지막 요소를 관찰
			if (node) {
				observerRef.current.observe(node); // 마지막 요소를 관찰
			}
		},
		[fetchNextPage, hasNextPage, isFetchingNextPage],
	);

	const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			setResultValue(searchValue);
		}
	};

	const handleSubmit = (msg: string) => {
		if (selectedFriend) {
			requestFriend({
				receiverId: selectedFriend.id,
				message: msg,
			});
		}
		setModalOpen(false);
	};

	const handleCancel = () => {
		if (selectedFriend) {
			cancelRequest({
				requestId: selectedFriend.id,
			});
		}
	};

	const handleAccept = () => {
		if (selectedFriend) {
			acceptRequest({
				requestId: selectedFriend.id,
			});
		}
	};

	return (
		<div className='flex flex-col h-full max-w-md mx-auto bg-white'>
			<div className='px-4 py-3'>
				<SearchBar
					placeholder='친구 ID'
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					onKeyDown={handleSearch}
				/>
			</div>

			{!resultValue ? (
				<div className='flex-1 p-4 flex items-center justify-center'>
					<span className='text-gray-500'>친구 ID를 검색해주세요.</span>
				</div>
			) : searchUsers?.length === 0 ? (
				<div className='flex-1 p-4 flex items-center justify-center'>
					<span className='text-gray-500'>검색 결과가 없습니다.</span>
				</div>
			) : (
				<div className='flex-1 p-4'>
					{searchUsers &&
						searchUsers.length > 0 &&
						searchUsers.map((user, index) => (
							<div
								ref={index === searchUsers.length - 1 ? lastElementRef : null}
								// 배열의 마지막 인덱스, 현재 요소가 마지막 요소인지 확인 -> 마지막일경우 lastElementRef 참조
								className='border rounded-lg p-6 flex flex-col items-center mb-4'
								key={user.id}
							>
								<UserMiniAvatar
									src={user.profileImage}
									size='lg'
									className='mb-3'
								/>
								<h2 className='font-bold mb-1'>{user.nickname}</h2>

								{user.relationStatus === 0 || user.relationStatus === 3 ? (
									<PrimaryBtn
										size='compact'
										name='친구 요청'
										color='black'
										onClick={() => {
											setModalOpen(true);
											setSelectedFriend(user);
										}}
										className='mt-3'
									/>
								) : user.relationStatus === 1 ? (
									<PrimaryBtn
										size='compact'
										name='요청 취소'
										color='gray'
										onClick={() => {
											setSelectedFriend(user);
											handleCancel();
										}}
										className='mt-3'
									/>
								) : user.relationStatus === 2 ? (
									<PrimaryBtn
										size='compact'
										name='요청 수락'
										color='primary'
										onClick={() => {
											handleAccept();
										}}
										className='mt-3'
									/>
								) : null}
							</div>
						))}
					{/* 다음 상태 불러오는지 체크 */}
					{isFetchingNextPage && (
						<div className='text-center py-4'>
							<span className='text-gray-500'>로딩 중...</span>
						</div>
					)}
				</div>
			)}
			{selectedFriend && (
				<FriendRequestMsgModal
					isOpen={modalOpen}
					onClose={() => setModalOpen(false)}
					friend={selectedFriend}
					onSubmit={handleSubmit}
				/>
			)}
		</div>
	);
};
