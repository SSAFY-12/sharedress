interface SwitchToggleProps {
	checked: boolean; // 스위치 상태
	onToggle: () => void; // 토글 이벤트
}

// 상태와 테마에 따라 배경색, 위치 변경
export const SwitchToggle = ({ checked, onToggle }: SwitchToggleProps) => (
	<button
		onClick={onToggle}
		className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
			checked ? 'bg-indigo-600' : 'bg-gray-200'
		}`}
	>
		<span
			className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
				checked ? 'translate-x-6' : 'translate-x-1'
			}`}
		/>
	</button>
);
