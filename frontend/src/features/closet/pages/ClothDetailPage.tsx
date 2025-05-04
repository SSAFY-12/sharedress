import { ClothItem } from '@/components/cards/cloth-card';
import Header from '@/components/layouts/Header';
import { CodiEditor } from '@/containers/CodiEditor';
import ClothDetailItem from '@/features/closet/components/ClothDetailItem';
import NavBar from '@/components/layouts/NavBar';
import { useNavigate } from 'react-router-dom';

const SampleClothItem: ClothItem = {
	id: '1',
	category: '아우터',
	name: '빈티지 워싱 카라 투웨이 크롭 데님자켓',
	imageUrl: 'https://picsum.photos/200',
};

const ClothDetailPage = () => {
	const navigate = useNavigate();

	const handleBackClick = () => {
		if (window.history.length > 1) {
			navigate(-1);
		} else {
			navigate('/');
		}
	};

	return (
		<div className='flex flex-col h-screen bg-white max-w-md mx-auto'>
			<Header showBack={true} onBackClick={handleBackClick} />

			<div className='flex-1 overflow-auto pb-20'>
				<CodiEditor item={SampleClothItem}>
					<div className='px-4'>
						<ClothDetailItem label='상품명' value={SampleClothItem.name} />
						<ClothDetailItem
							label='카테고리'
							value={SampleClothItem.category}
						/>
						<ClothDetailItem label='브랜드' value='앤드모어' />
						<ClothDetailItem label='색깔' value='데님' />
					</div>
				</CodiEditor>
			</div>

			<NavBar />
		</div>
	);
};

export default ClothDetailPage;
