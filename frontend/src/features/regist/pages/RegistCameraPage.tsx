import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layouts/Header';
import { InputField } from '@/components/inputs/input-field';
// import { SwitchToggle } from '@/components/buttons/switch-toggle';
import { BottomSheet } from '@/components/modals/bottom-sheet';
import { ImageDetailView } from '@/containers/ImageDetailView';
import { SearchBar } from '@/components/inputs/search-bar';
import { useBrandSearch } from '@/features/closet/hooks/useBrandSearch';
import { useCategoryList } from '@/features/closet/hooks/useCategoryList';
import { useDeferredValue } from 'react';
import { usePhotoClothStore } from '../stores/usePhotoClothStore';
import usePhotoCloth from '../hooks/usePhotoCloth';
import LoadingOverlay from '@/components/etc/LoadingOverlay';

const RegistCameraPage = () => {
	const navigate = useNavigate();
	const { items, currentIndex, updateItem, next } = usePhotoClothStore();

	const item = items[currentIndex];
	if (!item) return null;

	const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
	const [isBrandSheetOpen, setIsBrandSheetOpen] = useState(false);
	const [inputQuery, setInputQuery] = useState('');
	const [debouncedQuery, setDebouncedQuery] = useState('');
	const deferredQuery = useDeferredValue(debouncedQuery);

	const { data: brandResults = [], isLoading: isBrandLoading } =
		useBrandSearch(deferredQuery);
	const { data: categoryList = [], isLoading: isCategoryLoading } =
		useCategoryList();

	const { handleRegister, isLoading } = usePhotoCloth();

	const handleNext = () => {
		next();
	};

	const handleBack = () => {
		if (currentIndex === 0) {
			navigate('/regist');
		} else {
			usePhotoClothStore.getState().updateItem(currentIndex, item); // 현재 값 저장 (optional)
			usePhotoClothStore.setState((state) => ({
				currentIndex: state.currentIndex - 1,
			}));
		}
	};

	// 디바운싱 적용
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(inputQuery);
		}, 200);
		return () => clearTimeout(timer);
	}, [inputQuery]);

	return (
		<div className='flex flex-col h-screen bg-white w-full overflow-hidden'>
			{isLoading && <LoadingOverlay />}
			<Header
				showBack={true}
				subtitle={`${currentIndex + 1} / ${items.length}`}
				badgeText={currentIndex === items.length - 1 ? '완료' : '다음'}
				onBackClick={handleBack}
				onBadgeClick={
					currentIndex === items.length - 1 ? handleRegister : handleNext
				}
			/>

			<div className='flex-1 overflow-y-auto pb-9 scrollbar-hide'>
				<ImageDetailView
					item={{
						imageUrl: item.previewUrl,
						category: '',
						name: '',
					}}
				>
					<div className='px-4 space-y-4'>
						{/* 상품명 */}
						<div className='flex flex-col gap-2 items-start'>
							<label className='text-description text-low'>상품명</label>
							<InputField
								type='text'
								value={item.name}
								onChange={(e) =>
									updateItem(currentIndex, { name: e.target.value })
								}
							/>
						</div>

						{/* 카테고리 */}
						<div className='flex flex-col gap-2 items-start'>
							<label className='text-description text-low'>카테고리</label>
							<InputField
								type='select'
								value={
									categoryList.find((c) => c.id === item.categoryId)?.name ?? ''
								}
								onClick={() => setIsCategorySheetOpen(true)}
							/>
						</div>

						{/* 브랜드 */}
						<div className='flex flex-col gap-2 items-start'>
							<label className='text-description text-low'>브랜드</label>
							<InputField
								type='select'
								value={
									brandResults.find((b: any) => b.id === item.brandId)
										?.brandNameKor ?? ''
								}
								onClick={() => setIsBrandSheetOpen(true)}
							/>
						</div>

						{/* 공개 여부 */}
						{/* <div className='flex items-center justify-between pt-2'>
							<span className='text-default text-regular'>
								다른 사람에게 공개
							</span>
							<SwitchToggle
								checked={item.isPublic}
								onToggle={() =>
									updateItem(currentIndex, { isPublic: !item.isPublic })
								}
							/>
						</div> */}
					</div>
				</ImageDetailView>
			</div>

			{/* 카테고리 BottomSheet */}
			<BottomSheet
				isOpen={isCategorySheetOpen}
				onClose={() => setIsCategorySheetOpen(false)}
				snapPoints={[1]}
			>
				<div className='p-4 pt-0'>
					<p className='text-center text-button text-regular mb-4'>
						카테고리 선택
					</p>
					{isCategoryLoading ? (
						<p className='text-description text-center'>불러오는 중...</p>
					) : (
						<div className='flex flex-wrap gap-3 justify-center'>
							{categoryList.map((cat) => (
								<button
									key={cat.id}
									className='px-4 py-2 rounded-full bg-background text-low text-default hover:bg-light/50 transition-colors'
									onClick={() => {
										updateItem(currentIndex, { categoryId: cat.id });
										setIsCategorySheetOpen(false);
									}}
								>
									{cat.name}
								</button>
							))}
						</div>
					)}
				</div>
			</BottomSheet>

			{/* 브랜드 BottomSheet */}
			<BottomSheet
				isOpen={isBrandSheetOpen}
				onClose={() => setIsBrandSheetOpen(false)}
				snapPoints={[1]}
			>
				<div className='p-4 pt-2.5'>
					<SearchBar
						placeholder='브랜드 검색'
						value={inputQuery}
						onChange={(e) => setInputQuery(e.target.value)}
					/>
					<div className='mt-4 flex flex-wrap justify-start gap-2'>
						{isBrandLoading ? (
							<p className='text-description text-center w-full mt-6 mb-6'>
								검색 중...
							</p>
						) : brandResults.length === 0 ? (
							<p className='text-description text-center w-full mt-6 mb-6'>
								검색 결과 없음
							</p>
						) : (
							brandResults.map((brand: any) => (
								<button
									key={brand.id}
									className='px-4 py-2 rounded-full bg-background text-low text-default hover:bg-light/50 transition-colors'
									onClick={() => {
										updateItem(currentIndex, { brandId: brand.id });
										setIsBrandSheetOpen(false);
									}}
								>
									{brand.brandNameKor}
								</button>
							))
						)}
					</div>
				</div>
			</BottomSheet>
		</div>
	);
};

export default RegistCameraPage;
