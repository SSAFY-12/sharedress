// frontend/src/features/regist/pages/RegistSearchPage.tsx
import LibraryContainer from '@/features/regist/components/LibraryContainer';
import { ScrollToTopButton } from '@/features/regist/components/ScrollToTopButton';
import { useRef } from 'react';
import { getScrollableParent } from '@/features/regist/utils/getScrollableParent';

const RegistSearchPage = () => {
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);

	const handleScrollToTop = () => {
		console.log('올라가라!');
		const scrollTarget = getScrollableParent(scrollContainerRef.current);
		if (scrollTarget instanceof Window) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		} else {
			scrollTarget.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};
	return (
		<div
			className='flex-1 w-full h-full flex flex-col items-center px-4 gap-5 overflow-y-auto relative'
			ref={scrollContainerRef}
		>
			<LibraryContainer />
			<ScrollToTopButton onClick={handleScrollToTop} />
		</div>
	);
};

export default RegistSearchPage;
