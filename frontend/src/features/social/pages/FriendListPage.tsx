import { SearchBar } from '@/components/inputs/search-bar';
import { UserRowItem } from '@/containers/UserRowItem';
import { useState } from 'react';

// 메인 컴포넌트
export const FriendsListPage = () => {
	const [searchValue, setSearchValue] = useState('');

	// 더미 데이터
	const friends = [
		{
			id: 1,
			name: '예승아기',
			avatar: '/placeholder.svg?height=40&width=40',
			status: '난 도날드 덕이 좋아!',
		},
		{
			id: 2,
			name: '예승아기',
			avatar: '/placeholder.svg?height=40&width=40',
			status: '난 도날드 덕이 좋아!',
		},
		{
			id: 3,
			name: '예승아기',
			avatar: '/placeholder.svg?height=40&width=40',
			status: '난 도날드 덕이 좋아!',
		},
		{
			id: 4,
			name: '예승아기',
			avatar: '/placeholder.svg?height=40&width=40',
			status: '난 도날드 덕이 좋아!',
		},
		{
			id: 5,
			name: '예승아기',
			avatar: '/placeholder.svg?height=40&width=40',
			status: '난 도날드 덕이 좋아!',
		},
		{
			id: 6,
			name: '예승아기',
			avatar: '/placeholder.svg?height=40&width=40',
			status: '난 도날드 덕이 좋아!',
		},
	];

	const handleSearch = (e: any) => {
		e.preventDefault();
		// 검색 로직 구현
	};

	return (
		<div className='flex flex-col h-screen max-w-md mx-auto bg-white'>
			{/* 검색 영역 */}
			<div className='px-4 py-3'>
				<SearchBar
					placeholder='검색'
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					onSubmit={handleSearch}
				/>
			</div>

			{/* 친구 목록 영역 */}
			<div className='flex-1 overflow-auto'>
				{friends.map((friend) => (
					<UserRowItem
						key={friend.id}
						userName={friend.name}
						userAvatar={friend.avatar}
						onClick={() => console.log('Navigate to user profile')}
					/>
				))}
			</div>

			{/* 현재 채팅 표시 */}
			<div className='fixed bottom-20 right-6'>
				<div className='bg-rose-500 text-white rounded-full p-3 shadow-lg'>
					<span className='text-sm font-medium'>현재</span>
				</div>
			</div>

			{/* 네비게이션 바 */}
			<div className='border-t py-3 flex justify-around items-center'>
				<div className='flex flex-col items-center'>
					<div className='h-6 w-6 flex items-center justify-center'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'></path>
							<circle cx='12' cy='7' r='4'></circle>
						</svg>
					</div>
					<span className='text-xs mt-1'>FRIENDS</span>
				</div>

				<div className='flex flex-col items-center -mt-5'>
					<div className='bg-gray-800 rounded-full p-3'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							stroke='white'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<path d='M5 12h14'></path>
							<path d='M12 5v14'></path>
						</svg>
					</div>
				</div>

				<div className='flex flex-col items-center'>
					<div className='h-6 w-6 flex items-center justify-center'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'></path>
							<path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'></path>
						</svg>
					</div>
					<span className='text-xs mt-1'>CLOSET</span>
				</div>
			</div>
		</div>
	);
};
