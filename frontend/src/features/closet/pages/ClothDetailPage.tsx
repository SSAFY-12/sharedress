import Header from '@/components/layouts/Header';
import { CodiEditor } from '@/containers/CodiEditor';
import ClothDetailItem from '@/features/closet/components/ClothDetailItem';
import NavBar from '@/components/layouts/NavBar';
import { useNavigate, useParams } from 'react-router-dom';
import { useClothDetail } from '@/features/closet/hooks/useClothDetail';

const ClothDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const clothId = Number(id);

	const { data: cloth, isLoading, isError } = useClothDetail(clothId);

	const handleBackClick = () => {
		if (window.history.length > 1) {
			navigate(-1);
		} else {
			navigate('/');
		}
	};

	if (isLoading) return <div className='p-4'>불러오는 중...</div>;
	if (isError || !cloth)
		return <div className='p-4'>옷 정보를 불러오지 못했습니다.</div>;

	return (
		<div className='flex flex-col h-screen bg-white max-w-md mx-auto'>
			<Header showBack={true} onBackClick={handleBackClick} />

			<div className='flex-1 overflow-auto pb-20'>
				<CodiEditor
					item={{
						id: cloth.id.toString(),
						name: cloth.name,
						imageUrl: cloth.image,
						category: cloth.category.name,
					}}
				>
					<div className='px-4'>
						<ClothDetailItem label='상품명' value={cloth.name} />
						<ClothDetailItem label='카테고리' value={cloth.category.name} />
						<ClothDetailItem label='브랜드' value={cloth.brandName} />
						<ClothDetailItem label='색깔' value={cloth.color.name} />
					</div>
				</CodiEditor>
			</div>

			<NavBar />
		</div>
	);
};

export default ClothDetailPage;
