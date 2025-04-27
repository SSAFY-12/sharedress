interface ToastProps {
	message: string;
	type: 'success' | 'error' | 'warning' | 'info';
}

export const Toast = ({ message, type }: ToastProps) => {
	const typeClasses = {
		success: 'bg-green-100 text-green-800',
		error: 'bg-red-100 text-red-800',
		warning: 'bg-yellow-100 text-yellow-800',
		info: 'bg-blue-100 text-blue-800',
	};

	return (
		<div
			className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg ${typeClasses[type]}`}
		>
			{message}
		</div>
	);
};
