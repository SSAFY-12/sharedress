import ClothDetailItem from '@/features/closet/components/ClothDetailItem';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useClothDetail } from '@/features/closet/hooks/useClothDetail';
import { useState } from 'react';
import { BottomSheet } from '@/components/modals/bottom-sheet';
import { useDeleteCloth } from '@/features/closet/hooks/useDeleteCloth';
import { ImageDetailView } from '@/containers/ImageDetailView';
import Header from '@/components/layouts/Header';
import { toast } from 'react-toastify';

const ClothDetailPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams();
	const clothId = Number(id);
	const isMe = location.state?.isMe ?? false;
	const ownerId = location.state?.ownerId ?? 0;

	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const { data: cloth, isLoading, isError } = useClothDetail(clothId);
	console.log(cloth);
	const { mutate: deleteCloth } = useDeleteCloth();

	const handleMenuClick = () => {
		setIsMenuOpen(true);
	};

	const handleMenuClose = () => {
		setIsMenuOpen(false);
	};

	const handleBackClick = () => {
		if (isMe) {
			navigate('/mypage');
		} else if (ownerId) {
			navigate(`/friend/${ownerId}`);
		} else {
			navigate('/mypage');
		}
	};

	const handleEdit = () => {
		navigate(`/cloth/${clothId}/edit`);
	};

	const handleDelete = () => {
		if (!window.confirm('정말 삭제하시겠습니까?')) return;

		deleteCloth(clothId, {
			onSuccess: () => {
				toast.success('삭제되었습니다.', {
					icon: () => (
						<img
							src='/icons/toast_delete.svg'
							alt='icon'
							style={{ width: '20px', height: '20px' }}
						/>
					),
				});
				navigate('/mypage');
			},
			onError: () => {
				toast.error('삭제에 실패했습니다. 다시 시도해주세요.');
			},
		});
	};

	if (isLoading) return <div className='p-4'>불러오는 중...</div>;
	if (isError || !cloth)
		return <div className='p-4'>옷 정보를 불러오지 못했습니다.</div>;

	return (
		<div className='flex flex-col h-screen bg-white w-full overflow-hidden'>
			<Header showBack={true} onBackClick={handleBackClick} />
			<div className='flex-1 overflow-auto pb-20'>
				<ImageDetailView
					item={{
						// id: cloth.id, id 안받도록 처리
						name: cloth.name,
						imageUrl: cloth.image,
						category: cloth.category.name,
					}}
					showMoreButton={isMe}
					onMoreButtonClick={handleMenuClick}
				>
					<div className='px-4 flex flex-col gap-6'>
						<ClothDetailItem label='상품명' value={cloth.name} />
						<ClothDetailItem label='카테고리' value={cloth.category.name} />
						<ClothDetailItem label='브랜드' value={cloth.brand.name} />
						{/* <ClothDetailItem
							label='색깔'
							value={cloth.color.name}
							hexCode={cloth.color.hexCode}
						/> */}
						{isMe && (
							<ClothDetailItem
								label='공개 여부'
								value={cloth.isPublic ? '공개' : '비공개'}
							/>
						)}
					</div>
				</ImageDetailView>
			</div>

			{/* 수정 삭제 바텀 시트 */}
			<BottomSheet
				isOpen={isMenuOpen}
				onClose={handleMenuClose}
				snapPoints={[1]}
				initialSnap={0}
			>
				<div className='p-4 space-y-4'>
					<button
						className='w-full py-3 text-blue-500 font-medium text-center'
						onClick={handleEdit}
					>
						수정하기
					</button>
					<div className='border-t border-gray-200'></div>
					<button
						className='w-full py-3 text-red-500 font-medium text-center'
						onClick={handleDelete}
					>
						삭제하기
					</button>
				</div>
			</BottomSheet>
		</div>
	);
};

export default ClothDetailPage;
