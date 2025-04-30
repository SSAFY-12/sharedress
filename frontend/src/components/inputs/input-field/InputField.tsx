interface InputFieldProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	type?: 'text' | 'password' | 'email';
	error?: string;
}

export const InputField = ({
	value,
	onChange,
	placeholder,
	type = 'text',
	error,
}: InputFieldProps) => (
	<div className='w-full'>
		<input
			type={type}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			className={`w-full px-4 py-2 rounded-lg border ${
				error ? 'border-red-500' : 'border-gray-300'
			} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
		/>
		{error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
	</div>
);
