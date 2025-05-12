export const SubNavigation = () => {
	const categories = [
		'추천',
		'랭킹',
		'세일',
		'브랜드',
		'발매',
		'여름 신상',
		'5월 신발장',
	];

	return (
		<div className='bg-black text-white px-4 py-2 overflow-x-auto'>
			<div className='flex space-x-6'>
				{categories.map((category, index) => (
					<span key={index} className='whitespace-nowrap text-sm'>
						{category}
					</span>
				))}
			</div>
		</div>
	);
};
