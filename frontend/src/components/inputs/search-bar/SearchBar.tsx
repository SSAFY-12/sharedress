interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export const SearchBar = ({
	value,
	onChange,
	placeholder = 'Search...',
}: SearchBarProps) => (
	<div className='relative w-full'>
		<input
			type='text'
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			className='w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500'
		/>
		<div className='absolute left-3 top-1/2 transform -translate-y-1/2'>
			<svg
				className='w-5 h-5 text-gray-400'
				fill='none'
				stroke='currentColor'
				viewBox='0 0 24 24'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
				/>
			</svg>
		</div>
	</div>
);
