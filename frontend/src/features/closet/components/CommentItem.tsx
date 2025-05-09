import { MoreVertical } from 'lucide-react';
import { CommentItemProps } from './CommentItem.types';
import { formatDistanceToNow, parse } from 'date-fns';
import { ko } from 'date-fns/locale';

const CommentItem = ({ comment, onMoreClick, isMine }: CommentItemProps) => {
	const handleMoreClick = () => {
		if (onMoreClick) {
			onMoreClick(comment);
		}
	};

	const toRelativeTime = (dateString: string) => {
		try {
			const date = parse(dateString, 'yyyy. M. d. a h:mm:ss', new Date(), {
				locale: ko,
			});

			if (isNaN(date.getTime())) {
				console.log('뭔가 이상하다');
				return '';
			}

			return formatDistanceToNow(date, {
				addSuffix: true,
				locale: {
					...ko,
					formatDistance: (token: any, count: number, options?: any) => {
						const result = ko.formatDistance(token, count, options);
						return result.replace(/^약\s/, '');
					},
				},
			});
		} catch (error) {
			console.error('오류 발생:', dateString, error);
			return '';
		}
	};

	return (
		<div className='flex items-center'>
			<img
				src={comment.author.imageUrl || 'https://picsum.photos/200'}
				alt={comment.author.name}
				className='w-10 h-10 rounded-full mr-3'
			/>
			<div className='flex-1'>
				<div className='flex flex-col items-start'>
					<div className='flex items-center gap-4'>
						<span className='font-medium'>{comment.author.name}</span>
						<span className='text-xs text-gray-500'>
							{toRelativeTime(comment.createdAt)}
						</span>
					</div>
					<p className='mt-1'>{comment.content}</p>
				</div>
			</div>
			{isMine && (
				<button
					onClick={handleMoreClick}
					className='text-gray-400 p-1'
					aria-label='댓글 더보기'
				>
					<MoreVertical size={16} />
				</button>
			)}
		</div>
	);
};

export default CommentItem;
