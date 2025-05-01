import { SearchBar } from '@/components/inputs/search-bar';
import { useState } from 'react';

// 메인 컴포넌트
const FriendSearchPage = () => {
	const [searchValue, setSearchValue] = useState('');

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

			{/* 빈 영역 */}
			<div className='flex-1'></div>

			{/* 키보드 (실제로는 시스템 키보드가 표시됨) */}
		</div>
	);
};

export default FriendSearchPage;
