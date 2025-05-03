import NavBar from './layouts/NavBar';

const TestMobileLayout = () => (
	<div className='flex flex-col w-full h-full'>
		{/* Top Bar */}

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
		<NavBar />
	</div>
);
export default TestMobileLayout;
