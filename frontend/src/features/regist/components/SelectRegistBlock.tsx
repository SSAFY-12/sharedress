import React from 'react';
interface SelectRegistBlockProps {
	title: string;
	description: string;
	image: string;
	onClick: () => void;
	children?: React.ReactNode;
}

const SelectRegistBlock = ({
	title,
	description,
	image,
	onClick,
	children,
}: SelectRegistBlockProps) => (
	<div
		className='flex items-center justify-between bg-background w-full rounded-lg px-6 cursor-pointer'
		onClick={onClick}
	>
		{children}
		<div className='flex flex-col items-start justify-center gap-1.6 py-5'>
			<div className='flex text-topHeader text-regular'>{title}</div>
			<div className='flex text-description text-low'>{description}</div>
		</div>
		<img
			src={`/images/regist/${image}`}
			alt={title}
			className=' h-full object-cover'
		/>
	</div>
);

export default SelectRegistBlock;
