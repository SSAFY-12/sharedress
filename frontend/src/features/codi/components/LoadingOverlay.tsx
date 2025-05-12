const LoadingOverlay = () => (
	<div className='fixed inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-50'>
		<div className='relative w-14 h-14'>
			<div className='absolute inset-0 rounded-full border-4 border-t-transparent border-regular animate-spin' />
		</div>
		<p className='mt-6 text-regular text-default'>코디 저장 중이에요...</p>
	</div>
);

export default LoadingOverlay;
