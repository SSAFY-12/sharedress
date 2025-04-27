const TestMobileLayout = () => (
	<div className='flex flex-col w-full h-full'>
		{/* Top Bar */}
		<div className='flex items-center justify-between h-14 px-4 bg-white border-b border-gray-200'>
			<div className='font-bold text-lg text-gray-800'>로고</div>
			<button className='text-gray-500 text-sm'>버튼</button>
		</div>
		{/* Inner Content */}
		<div className='flex-1 overflow-y-auto px-2 py-4 space-y-4 bg-gray-50'>
			<div className='bg-white rounded-lg shadow p-4 text-center w-full'>
				Test Div 1
			</div>
			<div className='bg-white rounded-lg shadow p-4 text-center w-full'>
				Test Div 2
			</div>
			<div className='bg-white rounded-lg shadow p-4 text-center w-full'>
				Test Div 3
			</div>
			<div className='bg-white rounded-lg shadow p-4 text-center w-full'>
				Test Div 4
			</div>
			<div className='bg-white rounded-lg shadow p-4 text-center w-full'>
				Test Div 5
			</div>
		</div>
		{/* Bottom Navigation Bar */}
		<div className='flex items-center justify-between h-14 px-6 bg-white border-t border-gray-200'>
			<button className='flex-1 text-center text-gray-500'>홈</button>
			<button className='flex-1 text-center text-gray-500'>추가</button>
			<button className='flex-1 text-center text-gray-500'>설정</button>
		</div>
	</div>
);
export default TestMobileLayout;
