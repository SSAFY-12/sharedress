import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRemainingPhotoCount } from '@/features/regist/api/registApis';
import { toast } from 'react-toastify';
import { usePhotoClothStore } from '@/features/regist/stores/usePhotoClothStore';
import Header from '@/components/layouts/Header';

const RegistCameraPrePage = () => {
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [remainingPhotoCount, setRemainingPhotoCount] = useState<number | null>(
		null,
	);

	useEffect(() => {
		const fetchCount = async () => {
			try {
				const count = await fetchRemainingPhotoCount();
				console.log('남은 사진 개수:', count);
				setRemainingPhotoCount(count);
			} catch (err) {
				console.error('잔여 등록 개수 조회 실패:', err);
				toast.error('잔여 등록 개수 조회 실패');
			}
		};
		fetchCount();
	}, []);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (!files || remainingPhotoCount === null) return;

		const fileList = Array.from(files);
		const sliced = fileList.slice(0, remainingPhotoCount);

		// heic -> jpeg
		const convertedFiles = await Promise.all(
			sliced.map(async (file) => {
				if (
					file.type === 'image/heic' ||
					file.name.toLowerCase().endsWith('.heic')
				) {
					try {
						const { default: heic2any } = await import('heic2any');
						const jpegBlob = await heic2any({
							blob: file,
							toType: 'image/jpeg',
							quality: 0.9,
						});
						return new File(
							[jpegBlob as BlobPart],
							file.name.replace(/\.heic$/i, '.jpg'),
							{ type: 'image/jpeg' },
						);
					} catch (err) {
						console.error('HEIC 변환 실패:', err);
						toast.error('HEIC 파일을 변환할 수 없습니다.');
						return null;
					}
				}
				return file;
			}),
		);

		const validFiles = convertedFiles.filter((f): f is File => f !== null);

		if (fileList.length > remainingPhotoCount) {
			toast.info(`현재 최대 ${remainingPhotoCount}장까지 등록 가능합니다.`);
		}

		if (validFiles.length === 0) {
			toast.error('선택한 파일이 없습니다.');
			return;
		}

		usePhotoClothStore.getState().setItems(validFiles);
		navigate('/regist/camera');
	};

	const handleClickUploadBox = () => {
		if (remainingPhotoCount === 0) {
			toast.info('오늘은 더 이상 사진을 등록할 수 없어요.');
			return;
		}
		fileInputRef.current?.click();
	};

	const handleBack = () => {
		navigate('/regist');
	};

	return (
		<div className='flex flex-col flex-1 h-full'>
			<Header
				showBack={true}
				subtitle='사진으로 등록하기'
				onBackClick={handleBack}
			/>
			<div className='flex flex-col p-4 justify-center flex-1 pb-48'>
				<div className='flex flex-col items-start gap-2'>
					<h2 className='text-title text-regular'>사진으로 등록하기</h2>
					<div className='flex flex-col text-low text-default items-start'>
						<p>분류와 함께 사진을 등록하면</p>
						<p>AI가 자동으로 옷을 추출해줘요</p>
					</div>
				</div>
				<div className='mt-8 flex flex-col h-52'>
					<div
						className='bg-gray-50 rounded-xl flex-1 flex flex-col items-center justify-center p-8 cursor-pointer'
						onClick={handleClickUploadBox}
					>
						<div className='w-14 h-14 rounded-full bg-descriptionColor flex items-center justify-center mb-4'>
							<img src='icons/plus.svg' alt='plus' className='w-7 h-7' />
						</div>
						<p className='text-descriptionColor text-center text-default'>
							한번에 사진으로 등록하세요
						</p>
					</div>
				</div>
				<div className='mt-4 text-right'>
					<p>
						<span className='text-alarm text-categoryButton px-2'>
							오늘 등록 가능 사진 개수 {remainingPhotoCount} / 5
						</span>
					</p>
				</div>

				{/* 숨겨진 input */}
				<input
					ref={fileInputRef}
					type='file'
					accept='image/*'
					multiple
					className='hidden'
					onChange={handleFileChange}
				/>
			</div>
		</div>
	);
};

export default RegistCameraPrePage;
