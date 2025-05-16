interface LoadingOverlayProps {
	message?: string; // 메시지 전달, 기본값 제공
}

const LoadingOverlay = ({
	message = '잠시만 기다려 주세요...',
}: LoadingOverlayProps) => (
	<div className='fixed inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-50'>
		<div className='relative w-14 h-14'>
			<div className='absolute inset-0 rounded-full border-4 border-t-transparent border-regular animate-spin' />
		</div>
		<p className='mt-6 text-regular text-default'>{message}</p>
	</div>
);

export default LoadingOverlay;
