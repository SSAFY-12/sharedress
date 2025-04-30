interface UserMiniAvatarProps {
	src: string;
	size?: 'small' | 'medium' | 'large';
	name?: string;
}

export const UserMiniAvatar = ({
	src,
	size = 'medium',
	name,
}: UserMiniAvatarProps) => {
	const sizeClasses = {
		small: 'w-8 h-8',
		medium: 'w-12 h-12',
		large: 'w-16 h-16',
	};

	return (
		<div className='flex flex-col items-center'>
			<div
				className={`${sizeClasses[size]} relative overflow-hidden rounded-full`}
			>
				<img
					src={src}
					alt={name || 'User avatar'}
					className='w-full h-full object-cover'
				/>
			</div>
			{name && <p className='mt-1 text-sm font-medium'>{name}</p>}
		</div>
	);
};
