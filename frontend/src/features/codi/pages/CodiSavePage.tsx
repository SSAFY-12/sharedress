import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { myCodiSaveApi } from '@/features/codi/api/codiApi';
import Header from '@/components/layouts/Header';
import CodiCanvas from '@/features/codi/components/CodiCanvas';
import CodiSaveBottomSection from '@/features/codi/components/CodiSaveBottomSection';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const EMPTY_FN = () => {};

const CodiSavePage = () => {
	const navigate = useNavigate();
	const [codiItems, setCodiItems] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [description, setDescription] = useState('');
	const [isPublic, setIsPublic] = useState(true);

	useEffect(() => {
		const savedItems = localStorage.getItem('codiItems');
		if (savedItems) {
			setCodiItems(JSON.parse(savedItems));
		}
		setIsLoading(false);
	}, []);

	const handleBackClick = () => {
		if (window.history.length > 1) {
			navigate(-1);
		} else {
			navigate('/');
		}
	};

	const handleComplete = async () => {
		try {
			const formattedItems = codiItems.map((item) => ({
				id: Number(item.id),
				position: {
					x: item.position.x,
					y: item.position.y,
					z: item.zIndex,
				},
				scale: item.scale,
				rotation: item.rotation,
			}));

			const payload = {
				title: '임시 제목',
				description,
				isPublic,
				isTemplate: false,
				items: formattedItems,
			};

			await myCodiSaveApi(payload);
			alert('코디가 저장되었습니다!');
			navigate('/');
		} catch (error) {
			console.error('코디 저장 실패:', error);
			alert('코디 저장 실패');
		}
	};

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		setDescription(e.target.value);
	};

	const handlePublicToggle = () => {
		setIsPublic(!isPublic);
	};

	const headerProps = {
		showBack: true,
		badgeText: '완료',
		onBackClick: handleBackClick,
		onBadgeClick: handleComplete,
	};

	return (
		<div className='max-w-md mx-auto h-screen flex flex-col bg-white'>
			<Header {...headerProps} />
			<div className='flex-1 flex flex-col overflow-auto'>
				{isLoading ? (
					<div className='flex-1 flex items-center justify-center'>
						<p className='text-description'>로딩 중...</p>
					</div>
				) : (
					<>
						<div className='bg-gray-50'>
							<CodiCanvas
								items={codiItems}
								isEditable={false}
								updateItem={EMPTY_FN}
								removeItem={EMPTY_FN}
								maxZIndex={0}
								setMaxZIndex={EMPTY_FN}
							/>
						</div>
						<CodiSaveBottomSection
							description={description}
							isPublic={isPublic}
							isLoading={isLoading}
							onDescriptionChange={handleDescriptionChange}
							onPublicToggle={handlePublicToggle}
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default CodiSavePage;
