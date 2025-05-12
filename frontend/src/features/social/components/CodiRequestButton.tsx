interface CodiRequestButtonProps {
	onActionClick: () => void;
	actionButtonText: string;
}

const CodiRequestButton = ({
	onActionClick,
	actionButtonText,
}: CodiRequestButtonProps) => (
	<button
		type='button'
		className='py-2 px-3.5 rounded-xl hover:bg-gray-100 transition bg-brownButton text-white text-description'
		onClick={(e) => {
			e.stopPropagation();
			if (onActionClick) onActionClick();
		}}
	>
		{actionButtonText}
	</button>
);
