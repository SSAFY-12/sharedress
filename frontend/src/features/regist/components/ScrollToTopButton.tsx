import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
	onClick: () => void;
}

export const ScrollToTopButton = ({ onClick }: ScrollToTopButtonProps) => (
	<button
		onClick={onClick}
		className={`fixed bottom-6 right-6 sm:right-[calc(50%-280px+2rem)] p-3 z-50 bg-black opacity-65 text-background rounded-full`}
	>
		<ArrowUp size={20} />
	</button>
);
