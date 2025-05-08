import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/layouts/Header';
import { CodiEditor } from '@/containers/CodiEditor';
import CommentList from '@/features/closet/components/CommentList';
import { Comment } from '@/features/closet/components/CommentItem.types';
import { InputField } from '@/components/inputs/input-field';
import { BottomSheet } from '@/components/modals/bottom-sheet';
import { useCoordinationDetail } from '@/features/closet/hooks/useCoordinationDetail';
import { useCoordinationComments } from '@/features/closet/hooks/useCoordinationComments';
import { usePostCoordinationComment } from '@/features/closet/hooks/usePostCoordinationComment';
import { useCopyCoordination } from '@/features/closet/hooks/useCopyCoordination';

const CodiDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	const coordinationId = Number(id);

	console.log(coordinationId);

	const {
		data: coordination,
		isLoading,
		isError,
	} = useCoordinationDetail(coordinationId);
	const { data: commentsRaw = [] } = useCoordinationComments(coordinationId);

	const comments = commentsRaw.map((comment) => ({
		id: comment.id,
		content: comment.content,
		createdAt: new Date(comment.createdAt).toLocaleString(),
		author: {
			id: comment.creator.id.toString(),
			name: comment.creator.nickname,
			imageUrl: comment.creator.profileImage,
		},
	}));

	const { mutate: submitComment } = usePostCoordinationComment(coordinationId);
	const { mutate: copyCoordination } = useCopyCoordination();

	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isCommentFocused, setIsCommentFocused] = useState(false);
	const [commentText, setCommentText] = useState('');

	const handleBackClick = () => {
		navigate(-1);
	};

	const handleMenuClick = () => {
		setIsMenuOpen(true);
	};

	const handleMenuClose = () => {
		setIsMenuOpen(false);
	};

	const handleEdit = () => {
		console.log('수정하기 클릭');
		setIsMenuOpen(false);
	};

	const handleDelete = () => {
		console.log('삭제하기 클릭');
		setIsMenuOpen(false);
		navigate(-1);
	};

	const handleCommentChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		setCommentText(e.target.value);
	};

	const handleCommentSubmit = () => {
		if (commentText.trim()) {
			submitComment(commentText, {
				onSuccess: () => {
					setCommentText('');
					setIsCommentFocused(false);
				},
			});
		}
	};

	const handleCommentMoreClick = (comment: Comment) => {
		console.log('댓글 더보기 클릭', comment);
	};

	const handleAddToMyCloset = () => {
		copyCoordination(id!, {
			onSuccess: () => {
				alert('코디가 내 코디에 추가되었습니다.');
				navigate(`/mypage`);
			},
			onError: () => {
				alert('코디 추가에 실패했습니다.');
			},
		});
	};

	if (isLoading) return <div className='p-4'>불러오는 중...</div>;
	if (isError || !coordination)
		return <div className='p-4'>코디 정보를 불러오지 못했습니다.</div>;

	const isMyCodi = coordination.creator.id === coordination.owner.id;

	const item = {
		id: coordination.id.toString(),
		name: coordination.description,
		imageUrl: coordination.thumbnail || 'https://picsum.photos/200/300',
		category: '코디',
	};

	const recommender = !isMyCodi
		? {
				id: coordination.creator.id,
				name: coordination.creator.nickname,
				imageUrl: coordination.creator.profileImage,
		  }
		: null;

	return (
		<div className='flex flex-col h-screen bg-white max-w-md mx-auto overflow-hidden'>
			<Header showBack={true} onBackClick={handleBackClick} />

			{/* 메인 콘텐츠 */}
			<div className='flex-1 overflow-y-auto pb-24 relative'>
				<CodiEditor
					item={item}
					showMoreButton={true}
					onMoreButtonClick={handleMenuClick}
					recommender={recommender}
				>
					<div className='px-4'>
						<div className='flex flex-col items-start'>
							<p className='text-lg mb-1'>{coordination.description}</p>
							<p className='text-sm text-gray-500 mb-6'>
								{new Date(coordination.createdAt).toLocaleString()}
							</p>
						</div>

						{/* 댓글 */}
						<div className='pt-4'>
							<CommentList
								comments={comments}
								onCommentMoreClick={handleCommentMoreClick}
							/>
						</div>
					</div>
				</CodiEditor>
			</div>

			{/* 댓글 입력 영역 */}
			<div className='fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t z-10'>
				<div className='flex items-center p-4'>
					<InputField
						type='text'
						placeholder='댓글을 입력하세요'
						value={commentText}
						onChange={handleCommentChange}
						onFocus={() => setIsCommentFocused(true)}
					/>
					{isCommentFocused || commentText.trim() !== '' ? (
						<button
							className='ml-2 p-2 text-white rounded-full flex items-center justify-center'
							onClick={handleCommentSubmit}
						>
							<img src='/icons/submit.svg' alt='전송' className='w-5 h-5' />
						</button>
					) : null}
				</div>
			</div>

			{/* 수정 삭제 바텀 시트 */}
			<BottomSheet
				isOpen={isMenuOpen}
				onClose={handleMenuClose}
				snapPoints={[1]}
				initialSnap={0}
			>
				{isMyCodi ? (
					<div className='p-4 space-y-4'>
						<button
							className='w-full py-3 text-blue-500 font-medium text-center'
							onClick={handleEdit}
						>
							수정하기
						</button>
						<div className='border-t border-gray-200'></div>
						<button
							className='w-full py-3 text-red-500 font-medium text-center'
							onClick={handleDelete}
						>
							삭제하기
						</button>
					</div>
				) : (
					<div className='p-4 space-y-4'>
						<button
							className='w-full py-3 flex items-center justify-center gap-2 font-medium text-center text-[#c5a687]'
							onClick={handleAddToMyCloset}
						>
							<span className='text-xl'>🧥</span> 내 코디에 넣기
						</button>
						<div className='border-t border-gray-200'></div>
						<button
							className='w-full py-3 text-red-500 font-medium text-center'
							onClick={handleDelete}
						>
							삭제하기
						</button>
					</div>
				)}
			</BottomSheet>
		</div>
	);
};

export default CodiDetailPage;
