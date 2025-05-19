import React from 'react';

interface PlatFormBlockProps {
	title: string;
	description: string;
	image: string;
	onClick?: () => void;
	children?: React.ReactNode;
}

const PlatFormBlock = ({
	title,
	description,
	image,
	onClick,
	children,
}: PlatFormBlockProps) => (
	<div
		className='relative flex justify-start items-center gap-4 w-full p-2 py-2 cursor-pointer'
		onClick={onClick}
	>
		{children}
		<img
			src={`/images/regist/${image}`}
			alt={title}
			className='h-14 object-cover border border-light rounded-lg'
		/>
		<div className='flex flex-col items-start gap-1 py-2'>
			<h1 className='text-smallButton text-regular'>{title}</h1>
			<p className='text-description'>{description}</p>
		</div>
	</div>
);

export default PlatFormBlock;
