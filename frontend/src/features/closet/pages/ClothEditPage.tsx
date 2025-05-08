import { InputField } from '@/components/inputs/input-field';
import { SearchBar } from '@/components/inputs/search-bar';
import Header from '@/components/layouts/Header';
import { BottomSheet } from '@/components/modals/bottom-sheet';
import { CodiEditor } from '@/containers/CodiEditor';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ColorOption {
	name: string;
	tone: '웜' | '쿨';
	hex: string;
}

const colorOptions: ColorOption[] = [
	{ name: '블랙', tone: '웜', hex: '#1a1918' },
	{ name: '블랙', tone: '쿨', hex: '#16161a' },
	{ name: '화이트', tone: '웜', hex: '#fffcf2' },
	{ name: '화이트', tone: '쿨', hex: '#fdfcff' },
	{ name: '레드', tone: '웜', hex: '#e64b17' },
	{ name: '레드', tone: '쿨', hex: '#e6171a' },
	{ name: '블루', tone: '웜', hex: '#2ea8e6' },
	{ name: '블루', tone: '쿨', hex: '#2e2ee6' },
	{ name: '그린', tone: '웜', hex: '#63e622' },
	{ name: '그린', tone: '쿨', hex: '#22e684' },
	{ name: '옐로우', tone: '웜', hex: '#ffdd33' },
	{ name: '옐로우', tone: '쿨', hex: '#e1ff4d' },
	{ name: '퍼플', tone: '웜', hex: '#991f99' },
	{ name: '퍼플', tone: '쿨', hex: '#471f99' },
	{ name: '핑크', tone: '웜', hex: '#ff99aa' },
	{ name: '핑크', tone: '쿨', hex: '#ff99ee' },
	{ name: '브라운', tone: '웜', hex: '#996b3d' },
	{ name: '브라운', tone: '쿨', hex: '#995a54' },
	{ name: '그레이', tone: '웜', hex: '#737167' },
	{ name: '그레이', tone: '쿨', hex: '#636166' },
];

const ClothEditPage = () => {
	const navigate = useNavigate();
	const categories = ['아우터', '상의', '하의', '신발', '기타'];
	const allBrands = useMemo(
		() => ['유니클로', '나이키', '뉴발란스', '아디다스', '에잇세컨즈', 'H&M'],
		[],
	);

	const [name, setName] = useState('빈티지 워싱 투웨이 크롭티');
	const [category, setCategory] = useState('상의');
	const [brand, setBrand] = useState('앤드모어');
	const [colorName, setColorName] = useState('데님');
	const [colorHexCode, setColorHexCode] = useState('#2f3337');
	const [colorTone, setColorTone] = useState('쿨');

	const [inputQuery, setInputQuery] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const filteredBrands = useMemo(
		() => allBrands.filter((b) => b.includes(searchQuery.trim())),
		[allBrands, searchQuery],
	);

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSearchQuery(inputQuery);
	};

	const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
	const [isBrandSheetOpen, setIsBrandSheetOpen] = useState(false);
	const [isColorSheetOpen, setIsColorSheetOpen] = useState(false);

	const item = {
		id: '1',
		name,
		category,
		imageUrl: 'https://picsum.photos/200/300',
	};

	const handleDone = () => {
		console.log('수정 완료');
	};

	return (
		<div className='flex flex-col h-screen bg-white max-w-md mx-auto overflow-hidden'>
			<Header
				showBack={true}
				badgeText='완료'
				onBackClick={handleDone}
				onBadgeClick={() => navigate(-1)}
			/>
			<div className='flex-1 overflow-y-auto pb-24'>
				<CodiEditor item={item}>
					<div className='px-4 space-y-6'>
						{/* 상품명 */}
						<div className='flex flex-col gap-2 items-start'>
							<label htmlFor='name' className='text-sm text-gray-500 mb-1'>
								상품명
							</label>
							<InputField
								type='text'
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>

						<div className='flex flex-col gap-2 items-start'>
							<label htmlFor='category' className='text-sm text-gray-500 mb-1'>
								카테고리
							</label>
							<InputField
								type='select'
								value={category}
								onClick={() => setIsCategorySheetOpen(true)}
							/>
						</div>

						<div className='flex flex-col gap-2 items-start'>
							<label htmlFor='brand' className='text-sm text-gray-500 mb-1'>
								브랜드
							</label>
							<InputField
								type='select'
								value={brand}
								onClick={() => setIsBrandSheetOpen(true)}
							/>
						</div>

						<div className='flex flex-col gap-2 items-start'>
							<label htmlFor='color' className='text-sm text-gray-500 mb-1'>
								색상
							</label>
							<InputField
								type='color'
								value={`${colorName} (${colorTone})`}
								hexCode={colorHexCode}
								onClick={() => setIsColorSheetOpen(true)}
							/>
						</div>
					</div>
				</CodiEditor>
			</div>

			{/* 카테고리 BottomSheet */}
			<BottomSheet
				isOpen={isCategorySheetOpen}
				onClose={() => setIsCategorySheetOpen(false)}
				snapPoints={[1]}
				initialSnap={0}
			>
				<div className='p-4'>
					<p className='text-center text-sm text-gray-700 font-medium mb-4'>
						카테고리 선택
					</p>
					<div className='flex flex-wrap gap-3 justify-center'>
						{categories.map((category) => (
							<button
								key={category}
								onClick={() => {
									setCategory(category);
									setIsCategorySheetOpen(false);
								}}
								className='px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors'
							>
								{category}
							</button>
						))}
					</div>
				</div>
			</BottomSheet>

			{/* 브랜드 BottomSheet */}
			<BottomSheet
				isOpen={isBrandSheetOpen}
				onClose={() => setIsBrandSheetOpen(false)}
				snapPoints={[1]}
				initialSnap={0}
			>
				<div className='p-4'>
					<SearchBar
						placeholder='검색'
						value={inputQuery}
						onChange={(e) => setInputQuery(e.target.value)}
						onSubmit={handleSearchSubmit}
					/>
					<div className='mt-4 flex flex-wrap justify-start gap-2'>
						{searchQuery === '' ? (
							<p className='text-sm text-center text-gray-400 w-full mt-6 mb-6'>
								브랜드 명을 검색해주세요.
							</p>
						) : filteredBrands.length > 0 ? (
							filteredBrands.map((brand) => (
								<button
									key={brand}
									className='px-4 py-2 rounded-full bg-gray-100 text-sm text-gray-800 hover:bg-gray-200 transition'
									onClick={() => {
										setBrand(brand);
										setIsBrandSheetOpen(false);
									}}
								>
									{brand}
								</button>
							))
						) : (
							<p className='text-sm text-center text-gray-400 w-full mt-6 mb-6'>
								검색 결과가 없습니다.
							</p>
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
				<div className='p-4'>
					<div className='grid grid-cols-2 gap-3 justify-items-center'>
						{colorOptions.map((color) => (
							<button
								key={`${color.name}-${color.tone}`}
								className='px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm flex items-center gap-2 hover:bg-gray-200 transition'
								onClick={() => {
									setColorName(color.name);
									setColorHexCode(color.hex);
									setColorTone(color.tone);
									setIsColorSheetOpen(false);
								}}
							>
								<span
									className='w-4 h-4 rounded-full'
									style={{ backgroundColor: color.hex }}
								/>
								{color.name}
								<span className='text-xs text-gray-500'>({color.tone})</span>
							</button>
						))}
					</div>
				</div>
			</BottomSheet>
		</div>
	);
};

export default ClothEditPage;
