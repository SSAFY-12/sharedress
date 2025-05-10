interface ClothDetailItemProps {
	label: string;
	value: string;
	hexCode?: string;
}

const ClothDetailItem = ({ label, value, hexCode }: ClothDetailItemProps) => (
	<div className='flex justify-between items-center gap-4'>
		<span className='shrink-0 whitespace-nowrap text-default text-low'>
			{label}
		</span>
		<div className='max-w-[70%] text-right'>
			<div className='flex items-center gap-2.5 justify-end flex-wrap break-words'>
				{hexCode && (
					<div
						className='w-4 h-4 rounded-full shrink-0'
						style={{ backgroundColor: hexCode }}
					></div>
				)}
				<span className='text-default text-regular break-words text-right'>
					{value}
				</span>
			</div>
		</div>
	</div>
);

export default ClothDetailItem;
