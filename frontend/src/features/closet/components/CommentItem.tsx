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
		<div className='flex items-start justify-between'>
			<div className='flex items-center'>
				<img
					src={comment.author.imageUrl || 'https://picsum.photos/200'}
					alt={comment.author.name}
					className='w-11 h-11 rounded-full mr-4'
				/>
				<div className='flex-1'>
					<div className='flex flex-col items-start'>
						<div className='flex items-center gap-4'>
							<span className='text-smallButton text-regular'>
								{comment.author.name}
							</span>
							<span className='text-description text-descriptionColor'>
								{toRelativeTime(comment.createdAt)}
							</span>
						</div>
						<p className='mt-1.5 text-default text-regular'>
							{comment.content}
						</p>
					</div>
				</div>
			</div>

			{isMine && (
				<button
					onClick={handleMoreClick}
					className='text-gray-400 p-1'
					aria-label='댓글 더보기'
				>
					<img src='/icons/more.svg' alt='더보기' />
				</button>
			)}
		</div>
	);
};

export default CommentItem;
