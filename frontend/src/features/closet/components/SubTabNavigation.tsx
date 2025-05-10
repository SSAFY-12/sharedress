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
	<div className={`flex gap-4${className}`}>
		{tabs.map((tab) => (
			<button
				key={tab.id}
				className={`flex-1 py-2 px-3.5 rounded-full ${
					activeTab === tab.id
						? 'border border-regular text-regular'
						: 'border border-light text-low'
				}`}
				onClick={() => onTabChange(tab.id)}
			>
				{tab.label}
			</button>
		))}
	</div>
);

export default SubTabNavigation;
