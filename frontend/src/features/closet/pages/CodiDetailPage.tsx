import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { ko } from 'date-fns/locale';
import CommentList from '@/features/closet/components/CommentList';
import { Comment } from '@/features/closet/components/CommentItem.types';
import { InputField } from '@/components/inputs/input-field';
import { BottomSheet } from '@/components/modals/bottom-sheet';
import { useCoordinationDetail } from '@/features/closet/hooks/useCoordinationDetail';
import { useCoordinationComments } from '@/features/closet/hooks/useCoordinationComments';
import { usePostCoordinationComment } from '@/features/closet/hooks/usePostCoordinationComment';
import { useCopyCoordination } from '@/features/closet/hooks/useCopyCoordination';
import { useDeleteCoordination } from '@/features/closet/hooks/useDeleteCoordinations';
import { useDeleteCoordinationComment } from '@/features/closet/hooks/useDeleteCoordinationComment';
import { ImageDetailView } from '@/containers/ImageDetailView';
import Header from '@/components/layouts/Header';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'react-toastify';

const CodiDetailPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams();
	const isMe = location.state?.isMe ?? false;
	console.log('isMe:', isMe);
	const source = location.state?.source ?? 'my';
	console.log('source:', source);
	const ownerId = location.state?.ownerId ?? 0;
	const isGuest = useAuthStore((state) => state.isGuest);

	const coordinationId = Number(id);

	console.log(coordinationId);

	const {
		data: coordination,
		isLoading,
		isError,
	} = useCoordinationDetail(coordinationId);
	const { data: commentsRaw = [] } = useCoordinationComments(coordinationId);
	const { mutate: deleteCoordination } = useDeleteCoordination();
	const { mutate: deleteComment } =
		useDeleteCoordinationComment(coordinationId);

	const comments = commentsRaw.map((comment) => ({
		id: comment.id,
		content: comment.content,
		createdAt: new Date(comment.createdAt).toLocaleString(),
		author: {
			id: comment.creator.id,
			name: comment.creator.nickname,
			imageUrl: comment.creator.profileImage,
		},
	}));

	const { mutate: submitComment } = usePostCoordinationComment(coordinationId);
	const { mutate: copyCoordination } = useCopyCoordination();

	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isCommentFocused, setIsCommentFocused] = useState(false);
	const [commentText, setCommentText] = useState('');
	const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
	const [isCommentMenuOpen, setIsCommentMenuOpen] = useState(false);

	const handleMenuClick = () => {
		setIsMenuOpen(true);
	};

	const handleMenuClose = () => {
		setIsMenuOpen(false);
	};

	const handleEdit = () => {
		navigate(`/codi/${coordinationId}/edit`);
		setIsMenuOpen(false);
	};

	const handleDelete = () => {
		if (!window.confirm('정말 삭제하시겠습니까?')) return;

		deleteCoordination(coordinationId, {
			onSuccess: () => {
				toast.success('삭제되었습니다.', {
					icon: () => (
						<img
							src='/icons/toast_delete.svg'
							alt='icon'
							style={{ width: '20px', height: '20px' }}
						/>
					),
				});
				navigate('/mypage', {
					state: {
						initialTab: '코디',
					},
				});
			},
			onError: () => {
				toast.error('삭제에 실패했습니다. 다시 시도해주세요.');
			},
		});

		setIsMenuOpen(false);
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
					toast.success('댓글이 작성되었습니다.', {
						icon: () => (
							<img
								src='/icons/toast_comment.svg'
								alt='icon'
								style={{ width: '20px', height: '20px' }}
							/>
						),
					});
				},
				onError: () => {
					toast.error('댓글 작성에 실패했습니다. 다시 시도해주세요.');
				},
			});
		}
	};

	const handleCommentMoreClick = (comment: Comment) => {
		setSelectedComment(comment);
		setIsCommentMenuOpen(true);
	};

	const handleAddToMyCloset = () => {
		copyCoordination(coordinationId.toString(), {
			onSuccess: () => {
				toast.success('코디가 내 옷장에 추가되었습니다.', {
					icon: () => (
						<img
							src='/icons/toast_codi.svg'
							alt='icon'
							style={{ width: '20px', height: '20px' }}
						/>
					),
				});
				navigate(`/mypage`, {
					state: {
						initialTab: '코디',
					},
				});
			},
			onError: () => {
				toast.error('코디 추가에 실패했습니다.');
			},
		});
	};

	const handleCommentDelete = () => {
		if (!selectedComment) return;
		const confirmed = window.confirm('댓글을 삭제하시겠습니까?');
		if (!confirmed) return;

		deleteComment(selectedComment.id, {
			onSuccess: () => {
				setIsCommentMenuOpen(false);
				toast.success('댓글이 삭제되었습니다.', {
					icon: () => (
						<img
							src='/icons/toast_delete.svg'
							alt='icon'
							style={{ width: '20px', height: '20px' }}
						/>
					),
				});
			},
			onError: () => {
				toast.error('댓글 삭제에 실패했습니다. 다시 시도해주세요.');
			},
		});
	};

	const customKo = {
		...ko,
		formatDistance: (token: any, count: number, options?: any) => {
			const result = ko.formatDistance(token, count, options);
			return result.replace(/^약\s/, '');
		},
	};

	const sanitizeISOString = (dateString: string) =>
		dateString.replace(/(\.\d{3})\d+/, '$1');

	const toRelativeTime = (dateString: string) => {
		try {
			if (!dateString) return '';
			console.log(dateString);
			const sanitized = sanitizeISOString(dateString);
			const utcDate = parseISO(sanitized);
			const kstDate = toZonedTime(utcDate, 'Asia/Seoul');
			console.log(kstDate);

			if (isNaN(kstDate.getTime())) return '';

			return formatDistanceToNow(kstDate, {
				addSuffix: true,
				locale: customKo,
			});
		} catch (error) {
			console.error('오류 발생:', dateString, error);
			return '';
		}
	};

	if (isLoading) return <div className='p-4'>불러오는 중...</div>;
	if (isError || !coordination)
		return <div className='p-4'>코디 정보를 불러오지 못했습니다.</div>;

	const isMyCodi = coordination.creator.id === coordination.owner.id;
	const isCodiSourceMy = source === 'my';

	console.log(source);

	const handleBackClick = () => {
		if (isMe) {
			if (source === 'my') {
				navigate('/mypage', {
					state: { initialTab: '코디' },
				});
			} else if (source === 'friendspick') {
				console.log('안녕!!!!!!');
				navigate(`/mypage`, {
					state: { initialTab: '코디', initialSubTab: 'friendspick' },
				});
			}
		} else {
			if (source === 'friends') {
				navigate(`/friend/${ownerId}`, {
					state: { initialTab: '코디' },
				});
			} else if (source === 'recommended') {
				navigate(`/friend/${ownerId}`, {
					state: {
						initialTab: '코디',
						initialSubTab: 'recommended',
					},
				});
			}
		}
	};

	const item = {
		id: coordination.id,
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

	console.log(item.imageUrl);

	return (
		<div className='flex flex-col h-screen bg-white w-full overflow-hidden'>
			{isMe ? (
				<Header
					showBack={true}
					onBackClick={handleBackClick}
					badgeIcon='more'
					onBadgeClick={handleMenuClick}
				/>
			) : (
				<Header showBack={true} onBackClick={handleBackClick} />
			)}
			{/* 메인 콘텐츠 */}
			<div className='flex-1 overflow-y-auto pb-24 relative scrollbar-hide'>
				<ImageDetailView item={item} recommender={recommender}>
					<div className='px-4'>
						<div className='flex flex-col items-start gap-3'>
							<p className='text-regular text-default'>
								{coordination.description}
							</p>
							<p className='text-description text-descriptionColor mb-6'>
								{toRelativeTime(coordination.createdAt)}
							</p>
						</div>

						{/* 댓글 */}
						<div className='pb-4'>
							<CommentList
								comments={comments}
								onCommentMoreClick={handleCommentMoreClick}
							/>
						</div>
					</div>
				</ImageDetailView>
			</div>

			{/* 댓글 입력 영역 */}
			{!isGuest && (
				<div className='absolute bottom-0 left-0 right-0 bg-white border-t z-10'>
					<div className='w-full'>
						<div className='flex items-center p-4'>
							<InputField
								type='text'
								placeholder='댓글을 입력하세요'
								value={commentText}
								onChange={handleCommentChange}
								onFocus={() => setIsCommentFocused(true)}
								onBlur={() => setIsCommentFocused(false)}
							/>
							{isCommentFocused && (
								<button
									className='ml-4 p-0 text-white rounded-full flex items-center justify-center'
									onMouseDown={handleCommentSubmit}
								>
									<img src='/icons/submit.svg' alt='전송' />
								</button>
							)}
						</div>
					</div>
				</div>
			)}

			{/* 수정 삭제 바텀 시트 */}
			<BottomSheet
				isOpen={isMenuOpen}
				onClose={handleMenuClose}
				snapPoints={[1]}
				initialSnap={0}
			>
				{isCodiSourceMy ? (
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
							className='w-full py-3 flex items-center justify-center gap-2.5 font-medium text-center text-[#c5a687]'
							onClick={handleAddToMyCloset}
						>
							<img src='/icons/modal_closet_add.svg' alt='icon' />
							<span className='text-button text-low'>내 코디에 넣기</span>
						</button>
						<div className='border-t border-gray-200'></div>
						<button
							className='w-full py-3 text-delete text-button text-center'
							onClick={handleDelete}
						>
							삭제하기
						</button>
					</div>
				)}
			</BottomSheet>

			<BottomSheet
				isOpen={isCommentMenuOpen}
				onClose={() => setIsCommentMenuOpen(false)}
				snapPoints={[1]}
				initialSnap={0}
			>
				<div className='p-4 space-y-4'>
					<button
						className='w-full py-3 text-red-500 font-medium text-center'
						onClick={handleCommentDelete}
					>
						삭제하기
					</button>
				</div>
			</BottomSheet>
		</div>
	);
};

export default CodiDetailPage;
