const GuestTooltip = () => (
	<div className='absolute -bottom-7 left-1/2 transform -translate-x-1/2 z-50'>
		<div className='bg-regular text-white text-description px-3 py-2 rounded-lg shadow-lg relative w-auto whitespace-nowrap'>
			<div className='absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-regular' />
			친구에게 멋진 코디를 추천하세요!
		</div>
	</div>
);

export default GuestTooltip;
