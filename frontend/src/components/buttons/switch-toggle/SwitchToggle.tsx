import { SwitchToggleProps } from '@/components/buttons/switch-toggle/SwitchToggle.types';

export const SwitchToggle = ({
	checked,
	onToggle,
	variant = 'primary',
	className = '',
}: SwitchToggleProps) => (
	<button
		type='button'
		onClick={onToggle}
		className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
			checked
				? variant === 'primary'
					? 'bg-regular'
					: 'bg-regular'
				: 'bg-light'
		} ${className}`}
		role='switch'
		aria-checked={checked}
	>
		<span
			className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
				checked ? 'translate-x-[23px]' : 'translate-x-0'
			}`}
		/>
	</button>
);
