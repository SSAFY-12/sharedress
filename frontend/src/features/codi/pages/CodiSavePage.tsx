import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
	myCodiSaveApi,
	recommendedCodiSaveApi,
	SaveCodiRequest,
	uploadCodiThumbnail,
} from '@/features/codi/api/codiApi';
import Header from '@/components/layouts/Header';
import CodiCanvas from '@/features/codi/components/CodiCanvas';
import CodiSaveBottomSection from '@/features/codi/components/CodiSaveBottomSection';
import { base64ToFile } from '@/features/codi/utils/base64ToFile';
import { captureCanvasImageWithRetry } from '@/features/codi/utils/captureCanvasImageWithRetry';
import LoadingOverlay from '@/components/etc/LoadingOverlay';
import { toast } from 'react-toastify';
import { createPortal } from 'react-dom';

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
		if (mode === 'my') return await myCodiSaveApi(payload as SaveCodiRequest);
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
		if (savedItems) setCodiItems(JSON.parse(savedItems));
		setIsLoading(false);
	}, []);

	const handleBackClick = () => {
		navigate('/codi/edit', {
			state: { ...location.state, from: 'save' },
		});
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

			const container = document.getElementById('codi-canvas-capture');
			if (!container) throw new Error('캡처용 캔버스를 찾을 수 없습니다.');

			const isMobile = window.innerWidth < 640;
			const width = isMobile ? '320px' : '400px';
			const height = isMobile ? '352px' : '440px';

			const elementsToFix: {
				el: HTMLElement;
				originalWidth: string;
				originalHeight: string;
			}[] = [];
			let el: HTMLElement | null = container;
			for (let i = 0; i < 3; i++) {
				if (!el) break;
				elementsToFix.push({
					el,
					originalWidth: el.style.width,
					originalHeight: el.style.height,
				});
				el = el.parentElement as HTMLElement | null;
			}

			const codiCanvas = container;
			const originalClass = codiCanvas.className;
			codiCanvas.style.setProperty('width', width, 'important');
			codiCanvas.style.setProperty('height', height, 'important');
			elementsToFix.forEach(({ el }) => {
				el.style.setProperty('width', width, 'important');
				el.style.setProperty('height', height, 'important');
			});

			await new Promise((resolve, reject) => {
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						requestAnimationFrame(async () => {
							try {
								const base64 = await captureCanvasImageWithRetry(container, 2);
								const file = base64ToFile(base64, 'codi.png', 'image/png');
								const saved = await saveCodi(payload);
								const coordinationId = saved.content.id;
								await uploadCodiThumbnail(coordinationId, file);
								toast.success('코디가 저장되었습니다', {
									icon: () => (
										<img
											src='/icons/toast_codi.svg'
											alt='icon'
											style={{ width: '20px', height: '20px' }}
										/>
									),
								});
								if (mode === 'my') {
									localStorage.removeItem('codiItems');
									navigate('/mypage', {
										state: { initialTab: '코디' },
									});
								} else {
									localStorage.removeItem('codiItems');
									navigate(`/friend/${targetMemberId}`, {
										state: { initialTab: '코디', initialSubTab: 'recommended' },
									});
								}
								resolve(null);
							} catch (error) {
								reject(error);
							} finally {
								codiCanvas.className = originalClass;
								codiCanvas.style.removeProperty('width');
								codiCanvas.style.removeProperty('height');
								elementsToFix.forEach(
									({ el, originalWidth, originalHeight }) => {
										if (typeof originalWidth === 'string')
											el.style.width = originalWidth;
										if (typeof originalHeight === 'string')
											el.style.height = originalHeight;
										el.style.removeProperty('width');
										el.style.removeProperty('height');
									},
								);
							}
						});
					});
				});
			});
		} catch (error) {
			toast.error('코디 저장 실패');
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
		<>
			{/* [변경점: Portal 적용] 캡처용 CodiCanvas를 React Portal로 body에 직접 렌더합니다.\n    기존에는 컴포넌트 트리 내에 렌더되어 부모의 CSS(flex, overflow 등) 영향으로 캡처 실패/크기 오류가 발생할 수 있었으나,\n    Portal 적용으로 항상 원하는 크기/위치로 캡처가 100% 보장됩니다. (실제 사용자에게는 보이지 않음) */}
			{createPortal(
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '400px',
						height: '440px',
						pointerEvents: 'none',
						opacity: 0,
						zIndex: 9999,
					}}
				>
					<CodiCanvas
						items={codiItems}
						isEditable={false}
						updateItem={EMPTY_FN}
						removeItem={EMPTY_FN}
						maxZIndex={0}
						setMaxZIndex={EMPTY_FN}
						id='codi-canvas-capture'
						width={400}
						height={440}
					/>
				</div>,
				document.body,
			)}
			<div className='w-full h-screen flex flex-col bg-white'>
				{isSubmitting && <LoadingOverlay message='코디 저장 중이에요...' />}
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
									id='codi-canvas'
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
		</>
	);
};

export default CodiSavePage;
