import PlatFormBlock from '@/features/regist/components/PlatFormBlock';
import { useNavigate } from 'react-router-dom';
import { useScanStore } from '@/store/useScanStore';
import { useEffect, useState } from 'react';
import {
	getPrivacyAgreement,
	setPrivacyAgreement,
} from '@/features/regist/api/registApis';
import PrivacyModal from '@/features/regist/components/PrivacyModal';
import Header from '@/components/layouts/Header';
import { toast } from 'react-toastify';

const RegistScanPage = () => {
	const navigate = useNavigate();
	const isMusinsaScanning = useScanStore((state) => state.musinsa.isScan);
	console.log(isMusinsaScanning, 'isMusinsaScanning');

	const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

	useEffect(() => {
		const fetchPrivacyAgreement = async () => {
			try {
				const agreed = await getPrivacyAgreement();
				console.log(agreed, 'agreed');
				if (!agreed) setIsPrivacyModalOpen(true);
			} catch (error) {
				console.error('개인정보 동의 조회 실패', error);
				setIsPrivacyModalOpen(true);
			}
		};
		fetchPrivacyAgreement();
	}, []);

	const handleAgree = async () => {
		try {
			await setPrivacyAgreement(true);
			setIsPrivacyModalOpen(false);
		} catch (error) {
			console.error('개인정보 동의 설정 실패', error);
		}
	};

	const handleBack = () => {
		navigate('/regist');
	};

	return (
		<div className='flex flex-col h-full flex-1'>
			<Header
				showBack={true}
				subtitle='구매내역 스캔'
				onBackClick={handleBack}
			/>
			<div className='flex-1 w-full h-full flex flex-col justify-start items-center py-5 px-2 gap-1'>
				<PlatFormBlock
					title='무신사'
					description='https://www.musinsa.com'
					image='musinsa.png'
					onClick={() => {
						if (!isMusinsaScanning) {
							navigate('/regist/scan/musinsa');
						} else {
							toast.error('스캔 중에는 신규 등록이 불가능합니다.');
						}
					}}
				>
					{isMusinsaScanning && (
						<div className='absolute inset-0 bg-modify/30 rounded-lg z-10 flex items-center justify-center'>
							<div className='flex items-center justify-center gap-2'>
								<img
									src='/icons/loading.svg'
									className='w-4 h-4'
									alt='스캔중'
								/>
								<span className='text-white text-button w-full pr-4'>
									스캔 중
								</span>
							</div>
						</div>
					)}
				</PlatFormBlock>
				<div className='flex justify-start items-center gap-4 w-full relative py-2 px-2'>
					<div className='absolute inset-0 bg-black/30 rounded-lg z-10 flex items-center justify-center'>
						<span className='text-white text-button w-full pr-2'>
							업데이트 예정
						</span>
					</div>
					<img
						src='/images/regist/29cm.png'
						alt='29cm'
						className='h-14 object-cover border border-light rounded-lg'
					/>
					<div className='flex flex-col items-start gap-1 py-2'>
						<h1 className='text-smallButton text-regular'>29cm</h1>
						<p className='text-description'>https://www.29cm.co.kr</p>
					</div>
				</div>

				<PrivacyModal
					isOpen={isPrivacyModalOpen}
					onClose={() => setIsPrivacyModalOpen(false)}
					onAgree={handleAgree}
				/>
			</div>
		</div>
	);
};

export default RegistScanPage;
