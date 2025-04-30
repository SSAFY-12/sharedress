import { Search } from 'lucide-react';
import { SearchBarProps } from './SearchBar.types';

export const SearchBar = ({
	placeholder,
	value,
	onChange,
	onSubmit,
	className = '',
}: SearchBarProps) => (
	<form onSubmit={onSubmit} className={`w-full relative ${className}`}>
		<div className='relative'>
			<div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
				<Search className='h-4 w-4 text-gray-400' />
			</div>
			<input
				type='text'
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				className='border rounded-full pl-10 pr-4 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-500'
			/>
		</div>
	</form>
);
