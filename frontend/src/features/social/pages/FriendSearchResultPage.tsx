import { PrimaryBtn } from '@/components/buttons/primary-button';
import { UserMiniAvatar } from '@/components/cards/user-mini-avatar';
import { SearchBar } from '@/components/inputs/search-bar';
import { useState } from 'react';

// 내장된 컴포넌트 정의
// 메인 컴포넌트
export const FriendSearchResultPage = () => {
	const [searchValue, setSearchValue] = useState('돈까스현래');

	const handleSearch = (e: any) => {
		e.preventDefault();
		// 검색 로직 구현
	};

	return (
		<div className='flex flex-col h-screen max-w-md mx-auto bg-white'>
			{/* 검색 영역 */}
			<div className='px-4 py-3'>
				<SearchBar
					placeholder='친구 ID'
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					onSubmit={handleSearch}
				/>
			</div>

			{/* 검색 결과 */}
			<div className='flex-1 p-4'>
				<div className='border rounded-lg p-6 flex flex-col items-center'>
					<UserMiniAvatar
						src='/placeholder.svg?height=80&width=80'
						size='lg'
						className='mb-3'
					/>
					<h2 className='font-bold mb-1'>돈까스현래</h2>
					<PrimaryBtn
						size='compact'
						name='친구 신청'
						color='black'
						onClick={() => console.log('Send friend request')}
						className='mt-3'
					/>
				</div>
			</div>

			{/*(실제로는 시스템 키보드가 표시됨) */}
		</div>
	);
};
