import CommentItem from './CommentItem';

interface Comment {
	id: number;
	author: {
		id: string;
		name: string;
		imageUrl: string;
	};
	content: string;
	createdAt: string;
}

interface CommentListProps {
	comments: Comment[];
	onCommentMoreClick: (comment: Comment) => void;
	className?: string;
}

const CommentList = ({
	comments,
	onCommentMoreClick,
	className,
}: CommentListProps) => {
	if (comments.length === 0) {
		return (
			<p className='text-gray-500 text-center py-4'>아직 댓글이 없습니다.</p>
		);
	}

	return (
		<div className={`space-y-4 ${className}`}>
			{comments.map((comment) => (
				<CommentItem
					key={comment.id}
					comment={comment}
					onMoreClick={onCommentMoreClick}
				/>
			))}
		</div>
	);
};

export default CommentList;
