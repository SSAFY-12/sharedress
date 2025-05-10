import { ClothMainDisplay } from '@/components/cards/cloth-main-display/ClothMainDisplay';
import { Recommender } from '@/components/cards/cloth-main-display/ClothMainDisplay.types';
import { ImageDetailItem } from '@/constants/ImageDetailInterface';
import React from 'react';

interface ImageDetailViewProps {
	item: ImageDetailItem;
	editable?: boolean;
	onImageClick?: () => void;
	children: React.ReactNode;
	className?: string;
	showMoreButton?: boolean;
	onMoreButtonClick?: () => void;
	recommender?: Recommender | null;
}

export const ImageDetailView = ({
	item,
	editable = false,
	onImageClick,
	children,
	className = '',
	showMoreButton = false,
	onMoreButtonClick,
	recommender = null,
}: ImageDetailViewProps) => (
	<div className={`w-full max-w-3xl mx-auto ${className}`}>
		<div className='mb-6'>
			<ClothMainDisplay
				item={item}
				editable={editable}
				onClick={onImageClick}
				showMoreButton={showMoreButton}
				onMoreButtonClick={onMoreButtonClick}
				recommender={recommender}
			/>
		</div>
		<div className='space-y-4'>{children}</div>
	</div>
);
