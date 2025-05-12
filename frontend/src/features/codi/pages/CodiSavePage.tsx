import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
	myCodiSaveApi,
	recommendedCodiSaveApi,
	SaveCodiRequest,
	captureCanvasImage,
	uploadCodiThumbnail,
} from '@/features/codi/api/codiApi';
import Header from '@/components/layouts/Header';
import CodiCanvas from '@/features/codi/components/CodiCanvas';
import CodiSaveBottomSection from '@/features/codi/components/CodiSaveBottomSection';
import { base64ToFile } from '@/features/codi/utils/base64ToFile';
import LoadingOverlay from '@/features/codi/components/LoadingOverlay';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const EMPTY_FN = () => {};

const CodiSavePage = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const mode = location.state?.mode ?? 'my';
	const targetMemberId = location.state?.targetMemberId ?? 0;

	const saveCodi = async (
		payload: Omit<SaveCodiRequest, 'isPublic'> & { isPublic?: boolean },
	) => {
		if (mode === 'my') {
			return await myCodiSaveApi(payload as SaveCodiRequest);
		}
		if (!targetMemberId) throw new Error('targetMemberId is required');
		return await recommendedCodiSaveApi(targetMemberId.toString(), payload);
	};

	const [codiItems, setCodiItems] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [description, setDescription] = useState('');
	const [isPublic, setIsPublic] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

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
		setIsSubmitting(true);
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
				isTemplate: false,
				items: formattedItems,
				...(mode === 'my' ? { isPublic } : {}),
			};

			const container = document.getElementById('codi-canvas');
			if (!container) throw new Error('코디 캔버스를 찾을 수 없습니다.');

			const base64 = await captureCanvasImage(container);
			console.log('base64:', base64);

			const file = base64ToFile(base64, 'codi.png', 'image/png');
			console.log('[DEBUG] 변환된 File:', file);
			console.log('[DEBUG] 파일 크기:', file.size);

			const saved = await saveCodi(payload);
			const coordinationId = saved.content.id;
			console.log('[DEBUG] 저장된 coordinationId:', coordinationId);

			const result = await uploadCodiThumbnail(coordinationId, file);
			console.log('[DEBUG] 썸네일 업로드 응답:', result);

			alert('코디가 저장되었습니다!');
			if (mode === 'my') {
				navigate('/mypage', {
					state: { initialTab: '코디' },
				});
			} else {
				navigate(`/friend/${targetMemberId}`, {
					state: { initialTab: '코디', initialSubTab: 'recommended' },
				});
			}
		} catch (error) {
			console.error('코디 저장 실패:', error);
			alert('코디 저장 실패');
		} finally {
			setIsSubmitting(false);
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
		<div className='w-full h-screen flex flex-col bg-white'>
			{isSubmitting && <LoadingOverlay />}
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
							mode={mode}
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default CodiSavePage;
