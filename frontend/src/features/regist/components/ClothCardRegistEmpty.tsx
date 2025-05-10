// 선택 여부에 따라 테두리 색상 변경, 크기 동적 적용
export const ClothCardRegistEmpty = () => (
	<div className='flex flex-col w-full gap-4 items-center'>
		<div
			className={`w-full aspect-[10/11] border border-light overflow-hidden rounded-md relative`}
		>
			<div className='w-full h-full bg-background' />
		</div>

		<div className='flex flex-col items-start gap-2 px-1 w-full'>
			<div className='w-full pr-6'>
				<div className='w-full h-3 bg-background rounded-2xl' />
			</div>
			<div className='w-full pr-2'>
				<div className='w-full  h-4 bg-background rounded-2xl' />
			</div>
		</div>
	</div>
);
