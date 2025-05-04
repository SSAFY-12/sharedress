import { SearchBar } from '@/components/inputs/search-bar';
import { UserRowItem } from '@/containers/UserRowItem';
import { useState } from 'react';
// import useFriendList from '../hooks/useFriendList';

// 더미 데이터
const friends = [
	{
		id: 1,
		nickname: '예승아기',
		profileImage: 'https://picsum.photos/200/300?random=1',
		oneLiner: '난 도날드 덕이 좋아!',
	},
	{
		id: 2,
		nickname: '예승아기',
		profileImage: 'https://picsum.photos/200/300?random=2',
		oneLiner: '난 도날드 덕이 좋아!',
	},
	{
		id: 3,
		nickname: '예승아기',
		profileImage: 'https://picsum.photos/200/300?random=3',
		oneLiner: '난 도날드 덕이 좋아!',
	},
	{
		id: 4,
		nickname: '예승아기',
		profileImage: 'https://picsum.photos/200/300?random=4',
		oneLiner: '난 도날드 덕이 좋아!',
	},
	{
		id: 5,
		nickname: '예승아기',
		profileImage: 'https://picsum.photos/200/300?random=5',
		oneLiner: '난 도날드 덕이 좋아!',
	},
	{
		id: 6,
		nickname: '예승아기',
		profileImage: 'https://picsum.photos/200/300?random=6',
		oneLiner: '난 도날드 덕이 좋아!',
	},
];

// 메인 컴포넌트
export const FriendsListPage = () => {
	const [searchValue, setSearchValue] = useState('');
	// const { data: friends, isLoading, error } = useFriendList();

	const handleSearch = (e: any) => {
		e.preventDefault();
		// 검색 로직 구현
	};

	return (
		<div className='flex flex-col h-full max-w-md mx-auto bg-white'>
			{/* 검색 영역 */}
			<div className='py-3 px-3'>
				<SearchBar
					placeholder='친구 검색'
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					onSubmit={handleSearch}
				/>
			</div>

			{/* attribute button text넣어야함 */}
			{/* 친구 목록 영역 */}
			<div>
				{friends.map((friend) => (
					//id, nickname, profileImage, oneLiner
					<UserRowItem
						key={friend.id}
						userName={friend.nickname}
						userAvatar={friend.profileImage}
						userStatus={friend.oneLiner}
						actionType='arrow'
						onClick={() => console.log('Navigate to user profile')}
					/>
				))}
			</div>
		</div>
	);
};
