import { SearchBarProps } from './SearchBar.types';

export const SearchBar = ({
	placeholder,
	value,
	onChange,
	onSubmit,
	className = '',
}: SearchBarProps) => (
	<form onSubmit={onSubmit} className={`w-full relative ${className}`}>
		<div className='flex items-center justify-start gap-2 px-4 py-2.5 bg-background rounded-2xl'>
			<img src='/icons/search.svg' alt='search' className='pd-3' />
			<input
				type='text'
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				className='bg-background text-default text-regular placeholder:text-default placeholder:text-description outline-none'
			/>
		</div>
	</form>
);
