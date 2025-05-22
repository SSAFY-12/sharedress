export const UserRowItemEmpty = () => (
	<div className={`flex items-center justify-between py-2.5 last:border-b-0`}>
		<div className='flex items-center w-full h-full'>
			<div className='w-12 h-12 bg-background rounded-full' />
			<div className='flex flex-col text-left gap-1 w-full h-full py-1 justify-center'>
				<div className='ml-3 bg-background rounded-full w-12 h-5' />
				<div className='ml-3 bg-background rounded-full w-24 h-3' />
			</div>
		</div>
	</div>
);
