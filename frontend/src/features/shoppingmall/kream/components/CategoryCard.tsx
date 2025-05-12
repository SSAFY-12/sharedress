import { FC } from 'react';

interface CategoryCardProps {
	title: string;
	isSpecial?: boolean;
}

const CategoryCard: FC<CategoryCardProps> = ({ title, isSpecial = false }) => (
	<div className='bg-gray-100 p-4 rounded-md'>
		{isSpecial ? (
			<div className='h-40 flex items-center justify-center'>
				<h3 className='text-xl font-bold'>KREAM DRAW</h3>
			</div>
		) : (
			<div className='flex justify-center items-center gap-2 h-40'>
				<div className='h-20 w-20 bg-white border border-gray-300 rounded-md'></div>
				<div className='h-20 w-20 bg-gray-700 border border-gray-300 rounded-md'></div>
			</div>
		)}
		<div className='text-center mt-4'>
			<h3 className='font-medium'>{title}</h3>
		</div>
	</div>
);

export default CategoryCard;
