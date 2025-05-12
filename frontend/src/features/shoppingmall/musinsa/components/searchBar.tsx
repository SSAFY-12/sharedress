import type React from 'react';

import { Search } from 'lucide-react';

interface SearchBarProps {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => (
	<div className='relative'>
		<input
			type='text'
			value={value}
			onChange={onChange}
			placeholder='아유와는 트렌드, 리액트x리주비네이트'
			className='w-full py-2 px-4 pr-10 rounded-md bg-white text-black'
		/>
		<div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
			<Search className='h-5 w-5 text-gray-500' />
		</div>
	</div>
);
