interface PrimaryButtonProps {
	size: 'full' | 'medium' | 'compact'; // 버튼 크기
	name: string; // 버튼에 표시될 텍스트
	color: 'black' | 'gray'; // 버튼 색상
	activate: boolean; // 활성화 여부
	onClick: () => void; // 클릭 이벤트 핸들러
}

// 버튼의 크기, 색상, 활성화 상태에 따라 클래스 동적으로 할당
export const PrimaryButton = ({
	size,
	name,
	color,
	activate,
	onClick,
}: PrimaryButtonProps) => {
	const sizeClass = {
		full: 'w-full',
		medium: 'w-2/3',
		compact: 'w-1/3',
	}[size];

	const colorClass = {
		primary: 'bg-indigo-600',
		gray: 'bg-gray-400',
		black: 'bg-black',
	}[color];

	return (
		<button
			onClick={onClick}
			disabled={!activate}
			className={`${sizeClass} ${colorClass} text-white py-2 rounded-md text-sm font-semibold ${
				!activate ? 'opacity-50 cursor-not-allowed' : ''
			}`}
		>
			{name}
		</button>
	);
};
