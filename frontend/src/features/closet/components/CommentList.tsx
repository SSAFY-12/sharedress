import { useProfileStore } from '@/store/useProfileStore';
import CommentItem from './CommentItem';

interface Comment {
	id: number;
	author: {
		id: number;
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
	const profile = useProfileStore((state) => state.getMyId());

	if (comments.length === 0) {
		return (
			<p className='text-gray-500 text-center py-4'>아직 댓글이 없습니다.</p>
		);
	}

	return (
		<div className={`space-y-5 ${className}`}>
			{comments.map((comment) => (
				<CommentItem
					key={comment.id}
					comment={comment}
					isMine={comment.author.id === profile}
					onMoreClick={onCommentMoreClick}
				/>
			))}
		</div>
	);
};

export default CommentList;
