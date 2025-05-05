import React, { useState } from 'react';
import { ClothItem } from '@/components/cards/cloth-card';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layouts/Header';
import { CodiEditor } from '@/containers/CodiEditor';
import CommentList from '../components/CommentList';
import { Comment } from '../components/CommentItem.types';
import { InputField } from '@/components/inputs/input-field';
import { BottomSheet } from '@/components/modals/bottom-sheet';

const SampleCodiItems = {
	id: 101,
	imageUrl: 'https://picsum.photos/200/300',
	description: '벚꽃 나들이 룩~',
	createdAt: '7시간 전',
	comments: [
		{
			id: 1,
			author: {
				id: '1',
				name: '박예승',
				imageUrl: 'https://picsum.photos/200',
			},
			content: '내가 추천한 코디다!',
			createdAt: '6시간 전',
		},
		{
			id: 2,
			author: {
				id: '1',
				name: '박예승',
				imageUrl: 'https://picsum.photos/200',
			},
			content: '아주 예쁘군!',
			createdAt: '6시간 전',
		},
	],
};

const item: ClothItem = {
	id: SampleCodiItems.id.toString(),
	category: '코디',
	name: SampleCodiItems.description,
	imageUrl: SampleCodiItems.imageUrl,
};

const CodiDetailPage = () => {
	const navigate = useNavigate();
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
			console.log('댓글 등록:', commentText);
			setCommentText('');
			setIsCommentFocused(false);
		}
	};

	const handleCommentMoreClick = (comment: Comment) => {
		console.log('댓글 더보기 클릭', comment);
	};

	return (
		<div className='flex flex-col h-screen bg-white max-w-md mx-auto'>
			<Header showBack={true} onBackClick={handleBackClick} />

			{/* 메인 콘텐츠 */}
			<div className='flex-1 overflow-auto pb-16'>
				<CodiEditor
					item={item}
					showMoreButton={true}
					onMoreButtonClick={handleMenuClick}
				>
					<div className='px-4'>
						<div className='flex flex-col items-start'>
							<p className='text-lg mb-1'>{SampleCodiItems.description}</p>
							<p className='text-sm text-gray-500 mb-6'>
								{SampleCodiItems.createdAt}
							</p>
						</div>

						{/* 댓글 */}
						<div className='pt-4'>
							<CommentList
								comments={SampleCodiItems.comments}
								onCommentMoreClick={handleCommentMoreClick}
							/>
						</div>
					</div>
				</CodiEditor>
			</div>

			{/* 댓글 입력 영역 */}
			<div className='fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t'>
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
				snapPoints={[0.3]}
				initialSnap={0}
			>
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
			</BottomSheet>
		</div>
	);
};

export default CodiDetailPage;
