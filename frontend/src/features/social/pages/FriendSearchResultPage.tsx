import { PrimaryBtn } from '@/components/buttons/primary-button';
import { UserMiniAvatar } from '@/components/cards/user-mini-avatar';
import { SearchBar } from '@/components/inputs/search-bar';
import { FriendRequestMsgModal } from '@/features/social/components/FriendRequestMsgModal';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import useRequest from '@/features/social/hooks/useRequest';
import useSearchUser from '@/features/social/hooks/useSearchUser';
import { RelationStatus } from '@/features/social/types/social';

export const FriendSearchResultPage = () => {
	const [searchValue, setSearchValue] = useState('');
	const [resultValue, setResultValue] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [requestMessage, setRequestMessage] = useState(''); // 친구 요청 메시지
	const [selectedFriend, setSelectedFriend] = useState<{
		// 선택된 친구 정보
		profileImage: string;
		nickname: string;
		relationStatus: RelationStatus;
		memberId: number; //서버에서 memberId로 받아오기 때문
	} | null>(null);

	const { searchUsers, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useSearchUser(resultValue); // 검색 결과 목록 영역(무한 스크롤 구현)
	const { requestFriend, cancelRequest, acceptRequest } = useRequest(); // 친구 요청 전송/취소 버튼 로직

	// selectedFriend 객체 로깅
	useEffect(() => {
		console.log('selectedFriend : ', selectedFriend);
	}, [selectedFriend]);

	// Intersection Observer를 위한 ref
	const observerRef = useRef<IntersectionObserver | null>(null); // IntersectionObserver 객체 저장
	// 웹 브라우저에서 제공하는 API, 특정 요소가 화면에 보이는지 감지할 수 있게 해주는 기능

	// 마지막 요소를 관찰
	const lastElementRef = useCallback(
		// 불필요한 재생성 방지를 위해 함수 메모이제이션
		(node: HTMLDivElement | null) => {
			// 마지막 요소를 관찰하는 ref, node === 관찰할 HTML
			if (isFetchingNextPage) return; // 데이터 로딩 중이면 관찰 중단
			// 다음 페이지를 불러오면 관찰 중단 => 그니까 다음을 다 불러오기 전까지는 재요청을 하지 않도록 하기 위함
			// 중복 요청을 방지하기 위한 안전 장치

			// 이전 observer가 있다면 연결 해제
			if (observerRef.current) {
				observerRef.current.disconnect();
			}

			// 새로운 observer 생성(요소에 다음 페이지 로드 )
			observerRef.current = new IntersectionObserver((entries) => {
				// 첫 번째 요소가 화면에 보이고 있는지 확인 && 다음 페이지가 있는지 여부
				if (entries[0].isIntersecting && hasNextPage) {
					fetchNextPage(); // 다음 페이지 로드
				}
			});

			// 마지막 요소를 관찰(요소에 감시자 붙이기)
			if (node) {
				// 감시를 시작 하기 위한 요소가 있는지 확인
				//node === 감시 대상, observe는 감시 시작 -> 즉 감시할 대상이 실제로 있는지 확인
				observerRef.current.observe(node); // 마지막 요소를 관찰
			}
		},
		[hasNextPage, isFetchingNextPage, fetchNextPage],
	);

	const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			setResultValue(searchValue);
		}
	};

	const handleSubmit = () => {
		if (selectedFriend) {
			console.log('Submitting friend request:', {
				receiverId: selectedFriend.memberId,
				message: requestMessage,
			});
			requestFriend({
				receiverId: selectedFriend.memberId,
				message: requestMessage,
			});
			setModalOpen(false);
			setRequestMessage('');
		}
	};

	const handleCancel = () => {
		if (selectedFriend?.memberId) {
			console.log('Cancelling request with ID:', selectedFriend.memberId);
			cancelRequest(selectedFriend.memberId);
		} else {
			console.error('No request found for user:', selectedFriend);
		}
	};

	const handleAccept = () => {
		if (selectedFriend?.memberId) {
			console.log('Accepting request with ID:', selectedFriend.memberId);
			acceptRequest(selectedFriend.memberId);
		} else {
			console.error('No requestId found in selectedFriend:', selectedFriend);
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

			<div className='flex-1 p-4'>
				{searchUsers && searchUsers.length > 0 ? (
					searchUsers.map((user, index) => (
						<div
							ref={index === searchUsers.length - 1 ? lastElementRef : null}
							className='border rounded-lg p-6 flex flex-col items-center mb-4'
							key={user.memberId}
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
										console.log('Setting selectedFriend:', user); //정보가 맞게 출력되는 것을 볼 수 있음
										setModalOpen(true);
										setSelectedFriend({
											profileImage: user.profileImage,
											nickname: user.nickname,
											relationStatus: user.relationStatus,
											memberId: user.memberId,
										});
									}}
									className='mt-3'
								/>
							) : user.relationStatus === 1 ? (
								<PrimaryBtn
									size='compact'
									name='요청 취소'
									color='gray'
									onClick={() => {
										console.log('Setting selectedFriend for cancel:', user);
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
					))
				) : (
					<div className='flex items-center justify-center h-full'>
						<span className='text-gray-500'>
							{resultValue
								? '검색 결과가 없습니다.'
								: '친구 ID를 검색해주세요.'}
						</span>
					</div>
				)}
				{isFetchingNextPage && (
					<div className='text-center py-4'>
						<span className='text-gray-500'>로딩 중...</span>
					</div>
				)}
			</div>
			{selectedFriend && (
				<FriendRequestMsgModal
					isOpen={modalOpen}
					onClose={() => {
						setModalOpen(false);
						setRequestMessage('');
					}}
					friend={{
						profileImage: selectedFriend.profileImage,
						nickname: selectedFriend.nickname,
						receiverId: selectedFriend.memberId,
					}}
					message={requestMessage}
					onMessageChange={setRequestMessage}
					onConfirm={handleSubmit}
				/>
			)}
		</div>
	);
};
