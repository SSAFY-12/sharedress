import { SearchBar } from '@/components/inputs/search-bar';
import { UserRowItem } from '@/containers/UserRowItem';
import { useState } from 'react';
import useFriendList from '@/features/social/hooks/useFriendList';

// 더미 데이터
// const friends = [
// 	{
// 		id: 1,
// 		nickname: '예승아기',
// 		profileImage: 'https://picsum.photos/200/300?random=1',
// 		oneLiner: '난 도날드 덕이 좋아!',
// 	},
// 	{
// 		id: 2,
// 		nickname: '예승아기',
// 		profileImage: 'https://picsum.photos/200/300?random=2',
// 		oneLiner: '난 도날드 덕이 좋아!',
// 	},
// 	{
// 		id: 3,
// 		nickname: '예승아기',
// 		profileImage: 'https://picsum.photos/200/300?random=3',
// 		oneLiner: '난 도날드 덕이 좋아!',
// 	},
// 	{
// 		id: 4,
// 		nickname: '예승아기',
// 		profileImage: 'https://picsum.photos/200/300?random=4',
// 		oneLiner: '난 도날드 덕이 좋아!',
// 	},
// 	{
// 		id: 5,
// 		nickname: '예승아기',
// 		profileImage: 'https://picsum.photos/200/300?random=5',
// 		oneLiner: '난 도날드 덕이 좋아!',
// 	},
// 	{
// 		id: 6,
// 		nickname: '예승아기',
// 		profileImage: 'https://picsum.photos/200/300?random=6',
// 		oneLiner: '난 도날드 덕이 좋아!',
// 	},
// ];

// 메인 컴포넌트
export const FriendsListPage = () => {
	const [searchValue, setSearchValue] = useState(''); //친구 검색 값 -> 친구 검색 이벤트 전송시 서버 로직 ==> 지속해서 바뀌는 동적인 것
	// const [submitValue, setSubmitValue] = useState(''); // 검색 이벤트 전송시 서버 로직
	// const [searchResult, setSearchResult] = useState([]);
	// 내 친구 목록 검색
	const { data: friends } = useFriendList();
	// const { data: friends, isLoading, error } = useFriendList();
	// const { data: searchFriend, isLoading, error } = useSearchFriend(submitValue); // 검색 결과 목록 영역
	// searchValue가 계속적으로 바뀔텐데 ..??? -> 결과 데이터 반환될 것 근데 이 useSearch의 케이스가 다양하다..

	// 받아온 friend list에서 검색 -> 이건 근데 서버 로직이 필요없지 않나..? 그럼 fetching list자체에서
	// friends.nickname & friends.id 두개 중 하나만 받아오면 되는거 아닐까?
	// 그럼 검색 로직에서 필터링 하는거임

	const handleSearch = (e: any) => {
		e.preventDefault(); //이게 지금 필요한걸까?
		// setSubmitValue(searchValue);
		// 검색 로직 구현 -> 검색 결과 목록 영역에 데이터 반환
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
					//onsubmit은 제출,, -> enter 누르면 검색 이벤트 전송하도록
					// 제출할때, 마지막 공백은 trim으로 처리
				/>
			</div>

			{/* 검색을 하고 나면 검색 결과 목록 보여줘야함 -> 검색 결과 목록 컴포넌트 만들어야함 (친구 목록 영역이 아닌 검색 결과 목록 영역) */}

			{/* 전환될 영역 하위 -> searchValue 여부에 따라 */}

			{/* attribute button text넣어야함 */}
			{/* 친구 목록 영역 */}
			{!searchValue ? (
				<div>
					{friends?.map((friend) => (
						//id, nickname, profileImage, oneLiner
						<UserRowItem
							key={friend.id}
							userName={friend.nickname}
							userAvatar={friend.profileImage}
							userStatus={friend.oneLiner}
							actionType='arrow'
							onClick={() => console.log('Navigate to user profile')}
							// user 클릭시 프로필 이동
						/>
					))}
				</div>
			) : (
				// 검색 결과 목록 영역 -> 이게 바로 ..? 제출까지는 아닌거같은데 searchValue로 나오는게 맞나
				<div>
					<p>특정 ID를 검색한 후, enter를 눌러주세요.</p>
				</div>
			)}
		</div>
	);
};
