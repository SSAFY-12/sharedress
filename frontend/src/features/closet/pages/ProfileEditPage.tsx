import { PrimaryBtn } from '@/components/buttons/primary-button';
import { useMyProfile } from '@/features/closet/hooks/useMyProfile';
import { InputField } from '@/components/inputs/input-field/InputField';
import { SwitchToggle } from '@/components/buttons/switch-toggle/SwitchToggle';
import { useModifyProfile } from '@/features/social/hooks/useModifyProfile';
import { useModifyProfileImage } from '@/features/social/hooks/useModifyProfileImage';
import { useForm, Controller } from 'react-hook-form';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface ProfileEditForm {
	nickname: string;
	oneLiner: string;
	isPublic: boolean;
}

const ProfileEditPage = () => {
	const { data: profile } = useMyProfile();
	const { mutate: modifyProfile } = useModifyProfile();
	const { mutate: modifyProfileImage } = useModifyProfileImage();
	const navigate = useNavigate();

	const { handleSubmit, watch, setValue, control, reset } =
		useForm<ProfileEditForm>({
			defaultValues: {
				nickname: '',
				oneLiner: '',
				isPublic: true,
			},
		});

	// profile 데이터가 로드되면 form 값 업데이트
	useEffect(() => {
		if (profile) {
			reset({
				nickname: profile.nickname || '',
				oneLiner: profile.oneLiner || '',
				isPublic: profile.isPublic ?? true,
			});
		}
	}, [profile, reset]);

	// watch 예시: isPublic 값 변경 실시간 추적
	const watchIsPublic = watch('isPublic');

	// setValue 예시: 프로그래밍적으로 값 변경
	const handleToggle = () => {
		setValue('isPublic', !watchIsPublic, {
			shouldValidate: true,
			shouldDirty: true,
		});
	};

	/* -------- 갤러리에서 가져온 사진 상태 -------- */
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	
	/* 선택된 파일이 바뀌면 미리보기 URL 생성 */
	useEffect(() => {
		if (selectedFile) {
		  const newUrl = URL.createObjectURL(selectedFile);
		  setPreviewUrl(newUrl);
		  
		  // Clean up function
		  return () => {
			if (newUrl) URL.revokeObjectURL(newUrl);
		  };
		}
	  }, [selectedFile]);
	
	/* -------- 파일 input 제어 -------- */
	const fileRef = useRef<HTMLInputElement>(null);
	const openPicker = () => fileRef.current?.click();
	
	const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) setSelectedFile(file);
	};

	// 최종제출
	const onSubmit = handleSubmit((data) => {
		modifyProfile(
			{
				nickname: data.nickname,
				oneLiner: data.oneLiner,
				isPublic: data.isPublic,
			},
			{
				onSuccess: () => {
					if (selectedFile) {
						modifyProfileImage(selectedFile, {
						  onSuccess: () => {
							setTimeout(() => {
							  navigate('/mypage');
							}, 100);
						  },
						  onError: (error) => {
							console.error('프로필 이미지 수정 실패:', error);
						  }
						});
					  } else {
						// 이미지 변경이 없으면 바로 페이지 이동
						setTimeout(() => {
						  navigate('/mypage');
						}, 100);
					  }
				},
				onError: (error) => {
					console.error('프로필 수정 실패:', error);
				},
			},
		);
	});


	return (
		<form onSubmit={onSubmit} className='flex flex-col h-full'>
			<div className='flex-1 h-full flex flex-col overflow-y-auto px-4'>
				<div className='flex flex-col w-full justify-center items-center gap-1 pt-10 pb-1'>
					<div className='w-20 h-20 rounded-full overflow-hidden'>
						<img
  							src={previewUrl || profile?.profileImage || '/placeholder.svg'}
  							alt={`프로필 이미지`}
							className='w-full h-full object-cover'
						/>
					</div>
					<button
						type='button'
						onClick={openPicker}
						className='flex px-3 py-2 justify-center items-center text-modify text-categoryButton'
					>
						프로필 사진 변경
					</button>
					<input
						ref={fileRef}
						type='file'
						accept='image/*'
						hidden
						onChange={onFileChange}
					/>
				</div>
				<div className='flex flex-col gap-[18px] py-5'>
					<div className='flex flex-col gap-2'>
						<span className='text-low text-description text-left'>닉네임</span>
						<InputField
							type='text'
							value={watch('nickname')}
							placeholder='닉네임 입력'
							onChange={(e) => {
								if (e.target.value.length <= 10) {
									setValue('nickname', e.target.value);
								}
							}}
						/>
					</div>
					<div className='flex flex-col gap-2'>
						<span className='text-low text-description text-left'>소개</span>
						<InputField
							type='text'
							value={watch('oneLiner')}
							placeholder='한줄 소개 입력'
							onChange={(e) => {
								if (e.target.value.length <= 20) {
									setValue('oneLiner', e.target.value);
								}
							}}
						/>
					</div>
					<div className='flex justify-between items-center w-full p-2.5'>
						<span className='text-regular text-default'>프로필 공개</span>
						<Controller
							name='isPublic'
							control={control}
							render={({ field: { value } }) => (
								<SwitchToggle
									checked={value}
									onToggle={handleToggle}
									variant='primary'
								/>
							)}
						/>
					</div>
				</div>
			</div>
			<footer className='p-[18px] sticky w-full bottom-0 bg-white z-10'>
				<PrimaryBtn onClick={onSubmit} size='full' name='저장하기' />
			</footer>
		</form>
	);
};

export default ProfileEditPage;
