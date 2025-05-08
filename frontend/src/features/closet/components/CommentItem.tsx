import { MoreVertical } from 'lucide-react';
import { CommentItemProps } from './CommentItem.types';

const CommentItem = ({ comment, onMoreClick }: CommentItemProps) => {
	const handleMoreClick = () => {
		if (onMoreClick) {
			onMoreClick(comment);
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
						<span className='text-xs text-gray-500'>{comment.createdAt}</span>
					</div>
					<p className='mt-1'>{comment.content}</p>
				</div>
			</div>
			<button
				onClick={handleMoreClick}
				className='text-gray-400 p-1'
				aria-label='댓글 더보기'
			>
				<MoreVertical size={16} />
			</button>
		</div>
	);
};

export default CommentItem;
