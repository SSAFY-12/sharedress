export const Footer = () => (
	<footer className='bg-gray-100 py-4 px-4 mt-4'>
		<div className='flex justify-between items-center'>
			<div>
				<p className='text-sm text-gray-600'>
					© 2025 MUSINSA. All rights reserved.
				</p>
			</div>
			<div>
				<button className='p-2 bg-white rounded-full shadow'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M5 15l7-7 7 7'
						/>
					</svg>
				</button>
			</div>
		</div>
	</footer>
);
