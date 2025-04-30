import { SwitchToggleProps } from './SwitchToggle.types';

export const SwitchToggle = ({
	checked,
	onToggle,
	variant = 'primary',
	className = '',
}: SwitchToggleProps) => (
	<button
		type='button'
		onClick={onToggle}
		className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
			checked
				? variant === 'primary'
					? 'bg-rose-500'
					: 'bg-gray-600'
				: 'bg-gray-300'
		} ${className}`}
		role='switch'
		aria-checked={checked}
	>
		<span
			className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
				checked ? 'translate-x-6' : 'translate-x-0'
			}`}
		/>
	</button>
);
