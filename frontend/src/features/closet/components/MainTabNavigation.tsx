interface MainTabNavigationProps {
	activeTab: 'closet' | 'codi';
	onTabChange: (tab: 'closet' | 'codi') => void;
}

const MainTabNavigation = ({
	activeTab,
	onTabChange,
}: MainTabNavigationProps) => (
	<div className='flex border-b border-[#e6e5e5]'>
		<button
			className={`flex-1 py-4 text-center font-medium rounded-none ${
				activeTab === 'closet'
					? 'border-b-2 border-b-[#3a3636]'
					: 'text-[#a7a5a4]'
			}`}
			onClick={() => onTabChange('closet')}
		>
			옷장
		</button>
		<button
			className={`flex-1 py-4 text-center font-medium rounded-none ${
				activeTab === 'codi'
					? 'border-b-2 border-b-[#3a3636]'
					: 'text-[#a7a5a4]'
			}`}
			onClick={() => onTabChange('codi')}
		>
			코디
		</button>
	</div>
);

export default MainTabNavigation;
