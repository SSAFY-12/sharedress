export interface CommentAuthor {
	id: number;
	name: string;
	imageUrl: string;
}

export interface Comment {
	id: number;
	author: CommentAuthor;
	content: string;
	createdAt: string;
}

export interface CommentItemProps {
	comment: Comment;
	onMoreClick?: (comment: Comment) => void;
	isMine: boolean;
}
