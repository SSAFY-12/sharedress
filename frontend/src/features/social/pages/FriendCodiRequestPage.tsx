import { SearchBar } from '@/components/inputs/search-bar';
import { UserRowItem } from '@/containers/UserRowItem';
import React, { useEffect, useState } from 'react';
import { getOptimizedImageUrl } from '@/utils/imageUtils'; // 이미지 최적화
import useFriendList from '@/features/social/hooks/useFriendList';
import useSearchFriend from '@/features/social/hooks/useSearchFriend';
import { CodiRequestMsgModal } from '@/features/social/components/CodiRequestMsgModal';
import { useCodiRequest } from '@/features/social/hooks/useCodiRequest';

export interface Friend {
	nickname: string;
	profileImage: string;
	receiverId: number;
}

// 메인 컴포넌트
export const FriendCodiRequestPage = () => {
	const [searchValue, setSearchValue] = useState(''); // 검색어 입력값(현재 검색어 저장)
	const [keyword, setKeyword] = useState(''); // 실제 검색에 사용될 키워드 === 검색 API 호출시 사용되는 최종 검색어
	const { data: friends } = useFriendList(); // 친구 목록 데이터
	const { searchMyFriend } = useSearchFriend(keyword); // 검색 결과 목록 데이터

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

	// 선택된 친구
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
	const handleRequestClick = (request: Friend) => {
		setSelectedFriend({
			receiverId: request.receiverId,
			nickname: request.nickname,
			profileImage: request.profileImage,
		});
		setIsModalOpen(true);
	};

	const handleConfirm = () => {
		onSubmit();
		setIsModalOpen(false);
	};

	const { register, watch, onSubmit, setValue } = useCodiRequest(
		selectedFriend?.receiverId ?? 0,
	);

	// 친구 검색 이름 제한 20글자이내
	return (
		<div className='flex flex-col w-full h-full mx-auto bg-white gap-3.5 px-4 pt-2'>
			{/* 검색 영역 */}
			<SearchBar
				placeholder='친구 검색'
				value={searchValue}
				onChange={handleSearchChange}
				onKeyDown={handleSearch}
			/>

			<div className='flex w-full py-4 my-2.5 border border-dashed border-gray-300 rounded-2xl'>
				<span className='w-full text-button text-low'>
					{' '}
					외부에 코디 추천 요청{' '}
				</span>
			</div>

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
					{Array.isArray(searchMyFriend) && searchMyFriend.length > 0 ? (
						searchMyFriend.map((friend) => (
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
					) : (
						<p>검색 결과가 없습니다.</p>
					)}
				</div>
			)}
			{isModalOpen && selectedFriend && (
				<CodiRequestMsgModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					friend={selectedFriend}
					message={watch('message')}
					onMessageChange={(value) => setValue('message', value)}
					onConfirm={handleConfirm}
				/>
			)}
		</div>
	);
};
