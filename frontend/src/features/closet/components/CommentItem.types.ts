export interface CommentAuthor {
	id: string;
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
}
