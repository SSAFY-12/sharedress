import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
import { ClothMainDisplay } from '@/components/cards/cloth-main-display/ClothMainDisplay';
import React from 'react';

interface CodiEditorProps {
	item: ClothItem;
	editable?: boolean;
	onImageClick?: () => void;
	children: React.ReactNode;
	className?: string;
}

export const CodiEditor = ({
	item,
	editable = false,
	onImageClick,
	children,
	className = '',
}: CodiEditorProps) => (
	<div className={`w-full max-w-3xl mx-auto ${className}`}>
		<div className='mb-6'>
			<ClothMainDisplay
				item={item}
				editable={editable}
				onClick={onImageClick}
			/>
		</div>
		<div className='space-y-4'>{children}</div>
	</div>
);
