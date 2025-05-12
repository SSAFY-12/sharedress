import { PrimaryBtn } from '@/components/buttons/primary-button';
import { useMyProfile } from '../hooks/useMyProfile';
import { InputField } from '@/components/inputs/input-field/InputField';

const ProfileEditPage = () => {
	const { data: profile } = useMyProfile();
	console.log(profile);

	return (
		<div className='flex flex-col h-full'>
			<div className='flex-1 h-full flex flex-col overflow-y-auto px-4'>
				<div className='flex flex-col gap-2.5 pt-10 pb-2.5'>
					<div className='flex w-full justify-center items-center gap-2.5'>
						<div className='w-20 h-20 rounded-full overflow-hidden'>
							<img
								src={profile?.profileImage || 'https://picsum.photos/200'}
								alt={`나의 프로필 이미지`}
								className='w-full h-full object-cover'
							/>
						</div>
					</div>
					<span className='text-modify text-categoryButton'>
						프로필 사진변경
					</span>
				</div>
				<div className='flex flex-col gap-[18px] py-5 border border-red-500'>
					<div className='flex flex-col gap-2'>
						<span className='text-low text-description text-left'>닉네임</span>
						<InputField
							type='text'
							value={profile?.nickname || ''}
							placeholder='닉네임 입력'
							onChange={(e) => {
								console.log(e.target.value);
							}}
						/>
					</div>
					<div className='flex flex-col gap-2'>
						<span className='text-low text-description text-left'>소개</span>
						<InputField
							type='text'
							value={profile?.oneLiner || ''}
							placeholder='한줄 소개 입력'
							onChange={(e) => {
								console.log(e.target.value);
							}}
						/>
					</div>
				</div>
			</div>
			<footer className='p-[18px] sticky w-full bottom-0 bg-white z-10'>
				<PrimaryBtn size='full' name='저장하기' onClick={() => {}} />
			</footer>
		</div>
	);
};

export default ProfileEditPage;
