interface PlatFormBlockProps {
	title: string;
	description: string;
	image: string;
	onClick?: () => void;
}

const PlatFormBlock = ({
	title,
	description,
	image,
	onClick,
}: PlatFormBlockProps) => (
	<div
		className='flex justify-start items-center gap-4 w-full'
		onClick={onClick}
	>
		<img
			src={`/images/regist/${image}`}
			alt={title}
			className=' h-14 object-cover border border-light rounded-lg'
		/>
		<div className='flex flex-col items-start gap-1 py-2'>
			<h1 className='text-smallButton text-regular'>{title}</h1>
			<p className='text-description'>{description}</p>
		</div>
	</div>
);

export default PlatFormBlock;
