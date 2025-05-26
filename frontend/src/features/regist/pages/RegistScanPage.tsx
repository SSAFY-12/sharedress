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
	const is29cmScanning = useScanStore((state) => state.cm29.isScan);
	console.log(isMusinsaScanning, 'isMusinsaScanning');
	console.log(is29cmScanning, 'is29cmScanning');

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
							toast.info('스캔 중에는 신규 등록이 불가능합니다.');
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
				<PlatFormBlock
					title='29cm'
					description='https://www.29cm.co.kr'
					image='29cm.png'
					onClick={() => {
						if (is29cmScanning) {
							toast.info('스캔 중에는 신규 등록이 불가능합니다.');
							return;
						}
						navigate('/regist/scan/29cm');
					}}
				>
					{is29cmScanning && (
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
