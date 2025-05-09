interface ClothDetailItemProps {
	label: string;
	value: string;
	hexCode?: string;
}

const ClothDetailItem = ({ label, value, hexCode }: ClothDetailItemProps) => (
	<div className='flex justify-between items-center py-4'>
		<span className='text-gray-500'>{label}</span>
		<div>
			<div className='flex items-center gap-2.5'>
				{hexCode && (
					<div
						className='w-4 h-4 rounded-full'
						style={{ backgroundColor: hexCode }}
					></div>
				)}
				<span className='font-medium text-gray-800'>{value}</span>
			</div>
		</div>
	</div>
);

export default ClothDetailItem;
