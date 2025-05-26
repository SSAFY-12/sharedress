import { UserMiniAvatarProps } from '@/components/cards/user-mini-avatar/UserMiniAvatar.types';

export const UserMiniAvatar = ({
	src,
	size,
	withBadge = false,
	editable = false,
	onClick,
	className = '',
}: UserMiniAvatarProps) => {
	const sizeClass = {
		sm: 'w-8 h-8',
		md: 'w-12 h-12',
		lg: 'w-16 h-16',
	}[size];

	return (
		<div className={`relative ${className}`} onClick={onClick}>
			<img
				src={src || '/placeholder.svg?height=100&width=100'}
				alt='User Avatar'
				className={`${sizeClass} rounded-full object-cover border border-gray-200`}
				loading='lazy'
				referrerPolicy='no-referrer'
			/>
			{withBadge && (
				<span className='absolute bottom-0 right-0 bg-green-400 rounded-full w-3 h-3 border border-white' />
			)}
			{editable && (
				<span className='absolute bottom-0 right-0 bg-rose-500 rounded-full w-5 h-5 text-white text-xs flex items-center justify-center border border-white'>
					✏️
				</span>
			)}
		</div>
	);
};
