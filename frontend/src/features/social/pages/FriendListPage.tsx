import { SearchBar } from '@/components/inputs/search-bar';
import { UserRowItem } from '@/containers/UserRowItem';
import React, { useState, useCallback } from 'react';
import { getOptimizedImageUrl } from '@/utils/imageUtils'; // 이미지 최적화
import useFriendList from '@/features/social/hooks/useFriendList';
import useSearchFriend from '@/features/social/hooks/useSearchFriend';
import { useNavigate } from 'react-router-dom';
import { UserRowItemEmpty } from '@/containers/UserRowItemEmpty';

// 메인 컴포넌트
export const FriendsListPage = () => {
	const [searchValue, setSearchValue] = useState(''); // 검색어 입력값(현재 검색어 저장)
	const [keyword, setKeyword] = useState(''); // 실제 검색에 사용될 키워드 === 검색 API 호출시 사용되는 최종 검색어
	const { data: friends } = useFriendList(); // 친구 목록 데이터
	const { searchMyFriend, isFetchingMyFriend } = useSearchFriend(keyword); // 검색 결과 목록 데이터
	const [isWriting, setIsWriting] = useState(false);
	const navigate = useNavigate();

	const handleSearchChange = useCallback(
		({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
			if (value.length <= 20) {
				setSearchValue(value);
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

	const handleFriendArrowClick = (id: number) => {
		navigate(`/friend/${id}`);
	};

	// 친구 검색 이름 제한 20글자이내
	return (
		<div className='flex flex-col w-full h-full mx-auto bg-white gap-3.5 px-4 pt-2'>
			{/* 검색 영역 */}
			<SearchBar
				placeholder='친구 검색'
				value={searchValue}
				onChange={handleSearchChange}
				className='sticky top-0 z-10 bg-white'
			/>

			{/* 친구 목록 영역 */}
			{!keyword ? (
				<div>
					{friends?.map((friend) => (
						<UserRowItem
							key={friend.id}
							userName={friend.nickname}
							userAvatar={getOptimizedImageUrl(friend.profileImage)}
							userStatus={friend.oneLiner}
							actionType='arrow'
							onClick={() => handleFriendArrowClick(friend.id)}
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
								userName={friend.nickname}
								userAvatar={getOptimizedImageUrl(friend.profileImage)}
								userStatus={friend.oneLiner}
								actionType='arrow'
								onClick={() => handleFriendArrowClick(friend.id)}
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
		</div>
	);
};
