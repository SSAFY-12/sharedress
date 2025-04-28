const NavBar = () => (
	<div
		className='flex items-center justify-center h-20
     px-8 bg-white border-t border-gray-200 gap-x-16'
	>
		<button className='w-16 h-16 flex items-center justify-center bg-white'>
			<svg
				width='32'
				height='32'
				fill='none'
				stroke='gray'
				strokeWidth='2'
				viewBox='0 0 24 24'
			>
				<path d='M3 12L12 5l9 7' strokeLinecap='round' strokeLinejoin='round' />
				<path d='M9 21V12h6v9' strokeLinecap='round' strokeLinejoin='round' />
			</svg>
		</button>

		<button className='w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 shadow-lg'>
			<svg
				width='44'
				height='44'
				fill='none'
				stroke='#fff'
				strokeWidth='4'
				viewBox='0 0 24 24'
			>
				<g transform='scale(1.8) translate(-5 -5)'>
					<path d='M12 6v12M6 12h12' strokeLinecap='round' />
				</g>
			</svg>
		</button>

		<button className='w-16 h-16 flex items-center justify-center bg-white border-none'>
			<svg
				width='32'
				height='32'
				fill='none'
				stroke='gray'
				strokeWidth='2'
				viewBox='0 0 24 24'
			>
				<circle cx='12' cy='8' r='4' />
				<path d='M4 20c0-4 8-4 8-4s8 0 8 4' strokeLinecap='round' />
			</svg>
		</button>
	</div>
);

export default NavBar;
