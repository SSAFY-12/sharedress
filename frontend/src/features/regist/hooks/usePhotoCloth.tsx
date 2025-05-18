import { useNavigate } from 'react-router-dom';
import { uploadClothPhotos } from '@/features/regist/api/registApis';
import { toast } from 'react-toastify';
import { registerClothDetails } from '@/features/regist/api/registApis';
import { usePhotoClothStore } from '@/features/regist/stores/usePhotoClothStore';
import { useState } from 'react';

const usePhotoCloth = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const handleRegister = async () => {
		try {
			setIsLoading(true);

			const { items, reset } = usePhotoClothStore.getState();

			const uploaded = await uploadClothPhotos(items);
			if (!uploaded || uploaded.length !== items.length) {
				throw new Error('사진 업로드 개수가 일치하지 않습니다.');
			}

			await registerClothDetails(uploaded, items);

			toast.success('옷 등록 완료!');
			reset();
			navigate('/closet');
		} catch (error) {
			console.error('등록 실패:', error);
			toast.error('등록 중 문제가 발생했어요!');
		} finally {
			setIsLoading(false); // ✅ 완료/실패 상관없이 종료 시 로딩 종료
		}
	};

	return { handleRegister, isLoading };
};

export default usePhotoCloth;
