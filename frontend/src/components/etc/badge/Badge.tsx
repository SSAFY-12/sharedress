import { BadgeProps } from './Badge.types';
import {
	Bell,
	Settings,
	ArrowLeft,
	ArrowRight,
	Check,
	Info,
	AlertTriangle,
	XCircle,
} from 'lucide-react';

export const Badge = ({ icon, onClick, text, className = '' }: BadgeProps) => {
	const getIcon = () => {
		switch (icon) {
			case 'bell':
				return <Bell className='h-4 w-4' />;
			case 'setting':
				return <Settings className='h-4 w-4' />;
			case 'back':
				return <ArrowLeft className='h-4 w-4' />;
			case 'next':
				return <ArrowRight className='h-4 w-4' />;
			case 'done':
				return <Check className='h-4 w-4' />;
			case 'info':
				return <Info className='h-4 w-4' />;
			case 'success':
				return <Check className='h-4 w-4' />;
			case 'warning':
				return <AlertTriangle className='h-4 w-4' />;
			case 'error':
				return <XCircle className='h-4 w-4' />;
			default:
				return null;
		}
	};

	// text만 있을 때와 아이콘이 있을 때의 스타일을 분리
	const buttonStyle = icon
		? `inline-flex items-center gap-1 p-1.5 bg-gray-200 hover:bg-gray-300 rounded-full text-xs transition-colors ${className}`
		: `inline-flex items-center gap-1 text-xs ${className}`;

	return (
		<button onClick={onClick} className={buttonStyle}>
			{icon && getIcon()}
			{text}
		</button>
	);
};
