import { SearchBar } from '@/components/inputs/search-bar';
import { UserRowItem } from '@/containers/UserRowItem';
import React, { useState, useEffect, useCallback } from 'react';
import { getOptimizedImageUrl } from '@/utils/imageUtils'; // 이미지 최적화
import useFriendList from '@/features/social/hooks/useFriendList';
import useSearchFriend from '@/features/social/hooks/useSearchFriend';
import { CodiRequestMsgModal } from '@/features/social/components/CodiRequestMsgModal';
import { useCodiRequest } from '@/features/social/hooks/useCodiRequest';
import { ExternalShareModal } from '@/features/social/components/ExternalShareModal';
import { UserRowItemEmpty } from '@/containers/UserRowItemEmpty';

export interface Friend {
	nickname: string;
	profileImage: string;
	receiverId: number;
}

type ModalState = 'friend' | 'external' | null;

// 메인 컴포넌트
export const FriendCodiRequestPage = () => {
	const [searchValue, setSearchValue] = useState(''); // 검색어 입력값(현재 검색어 저장)
	const [keyword, setKeyword] = useState(''); // 실제 검색에 사용될 키워드 === 검색 API 호출시 사용되는 최종 검색어
	const [isWriting, setIsWriting] = useState(false);
	const { data: friends } = useFriendList(); // 친구 목록 데이터
	const { searchMyFriend, isFetchingMyFriend } =
		useSearchFriend(keyword); // 검색 결과 목록 데이터

	const handleSearchChange = useCallback(
		({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
			if (value.length <= 20) {
				setSearchValue(value);
				setIsWriting(true);
				const timer = setTimeout(() => {
					setKeyword(value);
				}, 700);
				const timer2 = setTimeout(() => {
					setIsWriting(false);
				}, 1000);
				return () => {
					clearTimeout(timer);
					clearTimeout(timer2);
				};
			}
		},
		[],
	);

	// 모달 state 관리
	const [isRequestModalOpen, setIsRequestModalOpen] =
		useState<ModalState>(null);

	// 외부 코디 요청 모달
	const handleExternalRequestClick = () => {
		setIsRequestModalOpen('external');
	};

	// 친구 코디 요청 모달
	const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
	const handleRequestClick = (request: Friend) => {
		setSelectedFriend({
			receiverId: request.receiverId,
			nickname: request.nickname,
			profileImage: request.profileImage,
		});
		setIsRequestModalOpen('friend');
	};

	const handleConfirm = () => {
		onSubmit();
		setIsRequestModalOpen(null);
	};

	const { watch, onSubmit, setValue } = useCodiRequest(
		selectedFriend?.receiverId ?? 0,
	);

	// 키보드 이벤트 처리
	useEffect(() => {
		const handleResize = () => {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<div className='flex flex-col w-full h-[calc(var(--vh,1vh)*100)] mx-auto bg-white gap-3.5 px-4 pt-2 overflow-y-auto'>
			<SearchBar
				placeholder='친구 검색'
				value={searchValue}
				onChange={handleSearchChange}
				className='sticky top-0 z-10 bg-white'
			/>

			<button
				className='flex w-full py-4 my-2.5 border border-dashed border-description hover:bg-background transition hover:border-low transition rounded-2xl'
				onClick={handleExternalRequestClick}
			>
				<span className='w-full text-button text-low'>
					외부에 코디 추천 요청
				</span>
			</button>

			{/* 친구 목록 영역 */}
			{!keyword ? (
				<div>
					{friends?.map((friend) => (
						//id, nickname, profileImage, oneLiner
						<UserRowItem
							key={friend.id}
							userId={friend.id}
							userName={friend.nickname}
							userAvatar={getOptimizedImageUrl(friend.profileImage)}
							userStatus={friend.oneLiner}
							actionType='button'
							actionButtonText='코디 요청'
							codiRequestClick={(request: Friend) =>
								handleRequestClick(request)
							}
						/>
					))}
				</div>
			) : (
				// 검색 결과 목록
				<div>
					{isFetchingMyFriend ? (
						<div>
							<UserRowItemEmpty />
							<UserRowItemEmpty />
							<UserRowItemEmpty />
						</div>
					) : (
						searchMyFriend?.map((friend) => (
							<UserRowItem
								key={friend.id}
								userId={friend.id}
								userName={friend.nickname}
								userAvatar={getOptimizedImageUrl(friend.profileImage)}
								userStatus={friend.oneLiner}
								actionType='button'
								actionButtonText='코디 요청'
								codiRequestClick={(request: Friend) =>
									handleRequestClick(request)
								}
							/>
						))
					)}
					{keyword &&
						!isFetchingMyFriend &&
						(!searchMyFriend || searchMyFriend.length === 0) &&
						!isWriting && (
							<p className='text-center text-default text-low mt-10'>
								검색 결과가 없습니다.
							</p>
						)}
				</div>
			)}
			{isRequestModalOpen === 'friend' && selectedFriend && (
				<CodiRequestMsgModal
					isOpen={isRequestModalOpen === 'friend'}
					onClose={() => setIsRequestModalOpen(null)}
					friend={selectedFriend}
					message={watch('message')}
					onMessageChange={(value) => setValue('message', value)}
					onConfirm={handleConfirm}
				/>
			)}

			{isRequestModalOpen === 'external' && (
				<ExternalShareModal
					isOpen={isRequestModalOpen === 'external'}
					onClose={() => setIsRequestModalOpen(null)}
				/>
			)}
		</div>
	);
};
