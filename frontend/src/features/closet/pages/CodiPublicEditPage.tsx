import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useCoordinationDetail } from '@/features/closet/hooks/useCoordinationDetail';
import { useEffect, useState } from 'react';
import Header from '@/components/layouts/Header';
import { ImageDetailView } from '@/containers/ImageDetailView';
import { SwitchToggle } from '@/components/buttons/switch-toggle';
import { updateCodiPublicStatus } from '@/features/closet/api/closetApi';

const CodiPublicEditPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const coordinationId = Number(id);

	const { data: codi } = useCoordinationDetail(coordinationId);
	const [isPublic, setIsPublic] = useState(true);

	useEffect(() => {
		if (codi) {
			setIsPublic(codi.isPublic);
		}
	}, [codi]);

	const handleDone = async () => {
		try {
			await updateCodiPublicStatus(coordinationId, isPublic);
			alert('공개 여부가 수정되었습니다.');
			navigate(`/codi/${coordinationId}`, { state: { isMe: true } });
		} catch (error) {
			console.error('수정 실패:', error);
			alert('수정에 실패했습니다. 다시 시도해주세요.');
		}
	};

	const headerProps = {
		showBack: true,
		badgeText: '완료',
		onBackClick: () => navigate(-1),
		onBadgeClick: handleDone,
	};

	return (
		<div className='flex flex-col h-screen bg-white w-full overflow-hidden'>
			<Header {...headerProps} />
			<div className='flex-1 overflow-y-auto pb-9 scrollbar-hide'>
				{codi && (
					<ImageDetailView
						item={{
							name: codi.description,
							imageUrl: codi.thumbnail,
							category: '나의 코디',
						}}
					>
						<div className='px-4 space-y-4'>
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
		</div>
	);
};

export default CodiPublicEditPage;
