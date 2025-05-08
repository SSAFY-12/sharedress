interface ClothDetailItemProps {
	label: string;
	value: string;
}

const ClothDetailItem = ({ label, value }: ClothDetailItemProps) => (
	<div className='flex justify-between items-center py-4'>
		<span className='text-gray-500'>{label}</span>
		<span className='font-medium text-gray-800'>{value}</span>
	</div>
);

export default ClothDetailItem;
