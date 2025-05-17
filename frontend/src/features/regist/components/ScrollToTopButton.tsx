import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
	onClick: () => void;
}

export const ScrollToTopButton = ({ onClick }: ScrollToTopButtonProps) => (
	<button
		onClick={onClick}
		className={`fixed bottom-6 right-6 sm:right-[calc(50%-280px+2rem)] p-3 z-50 bg-white border border-descriptionColor text-descriptionColor rounded-md shadow-md`}
	>
		<ArrowUp size={20} />
	</button>
);
