import { InputField } from '@/components/inputs/input-field';
import { SearchBar } from '@/components/inputs/search-bar';
import Header from '@/components/layouts/Header';
import { BottomSheet } from '@/components/modals/bottom-sheet';
import { ImageDetailView } from '@/containers/ImageDetailView';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClothDetail } from '../hooks/useClothDetail';
import { updateCloth } from '../api/closetApi';
import { SwitchToggle } from '@/components/buttons/switch-toggle';
import { useBrandSearch } from '../hooks/useBrandSearch';
import { useColorList } from '../hooks/useColorList';
import { useCategoryList } from '../hooks/useCategoryList';

const ClothEditPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const clothId = Number(id);

	const { data: cloth } = useClothDetail(clothId);
	const [name, setName] = useState('');
	const [category, setCategory] = useState('');
	const [brand, setBrand] = useState('');
	const [colorName, setColorName] = useState('');
	const [colorHexCode, setColorHexCode] = useState('');
	const [isPublic, setIsPublic] = useState(true);

	const [inputQuery, setInputQuery] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
		null,
	);
	const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSearchQuery(inputQuery);
	};

	const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
	const [isBrandSheetOpen, setIsBrandSheetOpen] = useState(false);
	const [isColorSheetOpen, setIsColorSheetOpen] = useState(false);

	const { data: brandResults = [], isLoading: isBrandLoading } =
		useBrandSearch(searchQuery);
	const { data: colorList = [], isLoading: isColorLoading } = useColorList();
	const { data: categoryList = [], isLoading: isCategoryLoading } =
		useCategoryList();

	useEffect(() => {
		if (cloth) {
			setName(cloth.name);
			setCategory(cloth.category.name);
			setSelectedCategoryId(cloth.category.id);
			setBrand(cloth.brand.name);
			setSelectedBrandId(cloth.brand.id);
			setColorName(cloth.color.name);
			setColorHexCode(cloth.color.hexCode);
			setSelectedColorId(cloth.color.id);
			setIsPublic(cloth.isPublic);
		}
	}, [cloth]);

	const handleDone = async () => {
		try {
			console.log(selectedColorId);
			const payload = {
				name,
				brandId: selectedBrandId ?? cloth?.brand.id ?? 0,
				categoryId: selectedCategoryId ?? cloth?.category.id ?? 0,
				colorId: selectedColorId ?? cloth?.color.id ?? 0,
				isPublic,
			};

			console.log(cloth?.color.id);
			console.log(selectedColorId);
			console.log(payload);

			await updateCloth(clothId, payload);
			alert('수정이 완료되었습니다.');
			navigate(`/cloth/${clothId}`, { state: { isMe: true } });
		} catch (error) {
			console.error('수정 실패:', error);
			alert('수정에 실패했습니다. 다시 시도해주세요.');
		}
	};

	return (
		<div className='flex flex-col h-screen bg-white w-full overflow-hidden'>
			<Header
				showBack={true}
				badgeText='완료'
				onBackClick={() => navigate(-1)}
				onBadgeClick={handleDone}
			/>
			<div className='flex-1 overflow-y-auto pb-9 scrollbar-hide'>
				{cloth && (
					<ImageDetailView
						item={{
							...cloth,
							imageUrl: cloth.image,
							category: cloth.category.name,
						}}
					>
						<div className='px-4 space-y-4'>
							{/* 상품명 */}
							<div className='flex flex-col gap-2 items-start'>
								<label htmlFor='name' className='text-description text-low'>
									상품명
								</label>
								<InputField
									type='text'
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>

							<div className='flex flex-col gap-2 items-start'>
								<label htmlFor='category' className='text-description text-low'>
									카테고리
								</label>
								<InputField
									type='select'
									value={category}
									onClick={() => setIsCategorySheetOpen(true)}
								/>
							</div>

							<div className='flex flex-col gap-2 items-start'>
								<label htmlFor='brand' className='text-description text-low'>
									브랜드
								</label>
								<InputField
									type='select'
									value={brand}
									onClick={() => setIsBrandSheetOpen(true)}
								/>
							</div>

							<div className='flex flex-col gap-2 items-start'>
								<label htmlFor='color' className='text-description text-low'>
									색상
								</label>
								<InputField
									type='color'
									value={`${colorName}`}
									hexCode={colorHexCode}
									onClick={() => setIsColorSheetOpen(true)}
								/>
							</div>

							<div className='flex items-center justify-between pt-2'>
								<span className='text-default text-regular'>
									다른 사람에게 공개
								</span>
								<SwitchToggle
									checked={isPublic}
									onToggle={() => setIsPublic(!isPublic)}
								/>
							</div>
						</div>
					</ImageDetailView>
				)}
			</div>

			{/* 카테고리 BottomSheet */}
			<BottomSheet
				isOpen={isCategorySheetOpen}
				onClose={() => setIsCategorySheetOpen(false)}
				snapPoints={[1]}
				initialSnap={0}
			>
				<div className='p-4 pt-0'>
					<p className='text-center text-button text-regular mb-4'>
						카테고리 선택
					</p>
					{isCategoryLoading ? (
						<p className='text-default text-center text-descriptionColor w-full mt-6 mb-6'>
							카테고리 불러오는 중...
						</p>
					) : (
						<div className='flex flex-wrap gap-3 justify-center'>
							{categoryList.map((category) => (
								<button
									key={category.id}
									onClick={() => {
										setCategory(category.name);
										setSelectedCategoryId(category.id);
										setIsCategorySheetOpen(false);
									}}
									className='px-4 py-2 rounded-full bg-background text-low text-default hover:bg-light/50 transition-colors'
								>
									{category.name}
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
				initialSnap={0}
			>
				<div className='p-4 pt-2.5'>
					<SearchBar
						placeholder='검색'
						value={inputQuery}
						onChange={(e) => setInputQuery(e.target.value)}
						onSubmit={handleSearchSubmit}
					/>
					<div className='mt-4 flex flex-wrap justify-start gap-2'>
						{isBrandLoading ? (
							<p className='text-default text-center text-descriptionColor w-full mt-6 mb-6'>
								검색 중...
							</p>
						) : searchQuery === '' ? (
							<p className='text-default text-center text-descriptionColor w-full mt-6 mb-6'>
								브랜드 명을 입력하세요.
							</p>
						) : brandResults.length === 0 ? (
							<p className='text-default text-center text-descriptionColor w-full mt-6 mb-6'>
								검색 결과가 없습니다.
							</p>
						) : (
							<div className='mt-3 mb-12 flex flex-wrap gap-3'>
								{brandResults.map(
									(brand: { id: number; brandNameKor: string }) => (
										<button
											key={brand.id}
											className='px-4 py-2 rounded-full bg-background text-low text-default hover:bg-light/50 transition-colors'
											onClick={() => {
												setBrand(brand.brandNameKor);
												setSelectedBrandId(brand.id);
												setIsBrandSheetOpen(false);
											}}
										>
											{brand.brandNameKor}
										</button>
									),
								)}
							</div>
						)}
					</div>
				</div>
			</BottomSheet>

			{/* 색상 BottomSheet */}
			<BottomSheet
				isOpen={isColorSheetOpen}
				onClose={() => setIsColorSheetOpen(false)}
				snapPoints={[1]}
				initialSnap={0}
			>
				<div className='p-4 pt-2.5 pb-6'>
					{isColorLoading ? (
						<p className='text-default text-center text-descriptionColor w-full mt-6 mb-6'>
							색상 불러오는 중...
						</p>
					) : (
						<div className='grid grid-cols-2 gap-3 justify-items-center'>
							{colorList.map((color) => (
								<button
									key={color.id}
									className='px-4 py-2 rounded-full bg-background text-low text-default flex items-center gap-2 hover:bg-light/50 transition-colors'
									onClick={() => {
										setColorName(color.name);
										setColorHexCode(color.hexCode);
										setSelectedColorId(color.id);
										setIsColorSheetOpen(false);
									}}
								>
									<span
										className='w-5 h-5 rounded-full'
										style={{ backgroundColor: color.hexCode }}
									/>
									{color.name}
								</button>
							))}
						</div>
					)}
				</div>
			</BottomSheet>
		</div>
	);
};

export default ClothEditPage;
