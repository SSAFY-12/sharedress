import { SearchBar } from '@/components/inputs/search-bar';
import { UserRowItem } from '@/containers/UserRowItem';
import React, { useState, useCallback, useEffect } from 'react';
import { getOptimizedImageUrl } from '@/utils/imageUtils'; // 이미지 최적화
import useFriendList from '@/features/social/hooks/useFriendList';
import { useNavigate } from 'react-router-dom';
import { UserRowItemEmpty } from '@/containers/UserRowItemEmpty';

// 메인 컴포넌트
export const FriendsListPage = () => {
	const [searchValue, setSearchValue] = useState(''); // 검색어 입력값(현재 검색어 저장)
	const { data: friends } = useFriendList(); // 친구 목록 데이터
	const [searchMyFriend, setSearchMyFriend] = useState<boolean>(false);
	const navigate = useNavigate();

	const useDebounce = (value: string, delay: number) => {
		const [debouncedValue, setDebouncedValue] = useState(value);
		useEffect(() => {
			const timer = setTimeout(() => {
				setDebouncedValue(value);
				setSearchMyFriend(false);
			}, delay);
			return () => clearTimeout(timer);
		}, [value, delay]);
		return debouncedValue;
	};

	const debouncedSearchValue = useDebounce(searchValue, 400);

	const handleSearchChange = useCallback(
		({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
			if (value.length <= 20) {
				setSearchMyFriend(true);
				setSearchValue(value);
			}
		},
		[],
	);

	useEffect(() => {
		if (debouncedSearchValue) {
			setSearchMyFriend(false);
		}
	}, [debouncedSearchValue]);

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
			{!debouncedSearchValue ? (
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
					{searchMyFriend ? (
						<div>
							<UserRowItemEmpty />
							<UserRowItemEmpty />
							<UserRowItemEmpty />
						</div>
					) : (
						friends
							?.filter((friend) =>
								friend.nickname.includes(debouncedSearchValue),
							)
							?.map((friend) => (
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
					{debouncedSearchValue &&
						!searchMyFriend &&
						friends?.filter((friend) =>
							friend.nickname.includes(debouncedSearchValue),
						).length === 0 && (
							<p className='text-center text-default text-low mt-10'>
								검색 결과가 없습니다.
							</p>
						)}
				</div>
			)}
		</div>
	);
};
