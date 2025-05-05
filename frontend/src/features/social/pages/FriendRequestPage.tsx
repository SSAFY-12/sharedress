import { PrimaryBtn } from '@/components/buttons/primary-button';
import { UserMiniAvatar } from '@/components/cards/user-mini-avatar';

// 메인 컴포넌트
export const FriendRequestsPage = () => {
	// 더미 데이터
	const friendRequests = [
		{
			id: 1,
			name: '예승아기',
			avatar: '/placeholder.svg?height=50&width=50',
			message: '나 갓긴데 안받아줄거야?',
		},
		{
			id: 1,
			name: '예승아기',
			avatar: '/placeholder.svg?height=50&width=50',
			message: '나 갓긴데 안받아줄거야?',
		},
	];

	return (
		<div className='flex flex-col h-screen max-w-md mx-auto bg-white'>
			{/* 친구 요청 목록 */}
			<div className='flex-1 p-4'>
				{friendRequests.map((request) => (
					<div
						key={request.id}
						className='flex items-center mb-4 border-b pb-4 last:border-b-0'
					>
						<UserMiniAvatar src={request.avatar} size='md' />
						<div className='ml-3 flex-1'>
							<h3 className='font-medium'>{request.name}</h3>
							<p className='text-sm text-gray-500'>{request.message}</p>
						</div>
						<PrimaryBtn
							size='compact'
							name='친구 수락'
							color='black'
							onClick={() => console.log('Accept friend request')}
						/>
					</div>
				))}
			</div>
		</div>
	);
};
