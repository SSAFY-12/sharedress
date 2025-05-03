interface SubTabNavigationProps<T extends string> {
	tabs: { id: T; label: string }[];
	activeTab: T;
	onTabChange: (tabId: T) => void;
	className?: string;
}

const SubTabNavigation = <T extends string>({
	tabs,
	activeTab,
	onTabChange,
	className = '',
}: SubTabNavigationProps<T>) => (
	<div className={`flex gap-4 ${className}`}>
		{tabs.map((tab) => (
			<button
				key={tab.id}
				className={`flex-1 py-3 px-4 rounded-full ${
					activeTab === tab.id
						? 'bg-[#3a3636] text-white'
						: 'bg-white border border-[#e6e5e5] text-[#6b6767]'
				}`}
				onClick={() => onTabChange(tab.id)}
			>
				{tab.label}
			</button>
		))}
	</div>
);

export default SubTabNavigation;
