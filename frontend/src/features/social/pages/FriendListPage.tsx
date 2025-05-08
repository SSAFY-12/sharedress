import { SearchBar } from '@/components/inputs/search-bar';
import { UserRowItem } from '@/containers/UserRowItem';
import React, { useState } from 'react';
import useFriendList from '@/features/social/hooks/useFriendList';
import useSearchFriend from '@/features/social/hooks/useSearchFriend';
import { getOptimizedImageUrl } from '@/utils/imageUtils';

// 메인 컴포넌트
export const FriendsListPage = () => {
	const [searchValue, setSearchValue] = useState(''); // 검색어 입력값(현재 검색어 저장)
	const [keyword, setKeyword] = useState(''); // 실제 검색에 사용될 키워드 === 검색 API 호출시 사용되는 최종 검색어
	// 내 친구 목록 검색
	const { data: friends } = useFriendList();
	const { searchMyFriend } = useSearchFriend(keyword);

	// 친구 검색 전송 이벤트
	const handleSearch = (e: any) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			setKeyword(searchValue);
		}
	};

	// 친구 검색 이름 제한 20글자이내
	const handleSearchChange = ({
		target: { value },
	}: React.ChangeEvent<HTMLInputElement>) => {
		if (value.length <= 20) {
			setSearchValue(value);
		}
	};

	// 친구 검색 이름 제한 20글자이내
	return (
		<div className='flex flex-col h-full max-w-md mx-auto bg-white'>
			{/* 검색 영역 */}
			<div className='py-3 px-3'>
				<SearchBar
					placeholder='친구 검색 (최대 20자)'
					value={searchValue}
					onChange={handleSearchChange}
					onKeyDown={handleSearch}
				/>
			</div>

			{/* 검색을 하고 나면 검색 결과 목록 보여줘야함 -> 검색 결과 목록 컴포넌트 만들어야함 (친구 목록 영역이 아닌 검색 결과 목록 영역) */}
			{/* 전환될 영역 하위 -> searchValue 여부에 따라 */}
			{/* attribute button text넣어야함 */}
			{/* 친구 목록 영역 */}
			{!keyword ? (
				<div>
					{friends?.map((friend) => (
						//id, nickname, profileImage, oneLiner
						<UserRowItem
							key={friend.id}
							userName={friend.nickname}
							userAvatar={getOptimizedImageUrl(friend.profileImage)}
							userStatus={friend.oneLiner}
							actionType='arrow'
							onClick={() => console.log('Navigate to user profile')}
							// user 클릭시 프로필 이동
						/>
					))}
				</div>
			) : (
				// 검색 결과 목록
				<div>
					{Array.isArray(searchMyFriend) && searchMyFriend.length > 0 ? (
						searchMyFriend.map((friend) => (
							<UserRowItem
								key={friend.id}
								userName={friend.nickname}
								userAvatar={getOptimizedImageUrl(friend.profileImage)}
								userStatus={friend.oneLiner}
								actionType='arrow'
								onClick={() => console.log('Navigate to user profile')}
								//user 클릭시 프로필 이동
							/>
						))
					) : (
						<p>검색 결과가 없습니다.</p>
					)}
				</div>
			)}
		</div>
	);
};
