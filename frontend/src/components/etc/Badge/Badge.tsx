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
import { BadgeProps } from '.';

export const Badge = ({
	iconType,
	onClick,
	text,
	useIcon = true,
	className = '',
}: BadgeProps) => {
	const renderIcon = () => {
		switch (iconType) {
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

	return (
		<button
			onClick={onClick}
			className={`inline-flex items-center justify-center p-1.5 bg-gray-200 hover:bg-gray-300 rounded-full text-xs transition-colors ${className}`}
		>
			{useIcon ? renderIcon() : text}
		</button>
	);
};
