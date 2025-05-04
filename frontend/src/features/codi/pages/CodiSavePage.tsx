import Header from '@/components/layouts/Header';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResultCodiCanvas from '../components/ResultCodiCanvas';
import { InputField } from '@/components/inputs/input-field';
import { SwitchToggle } from '@/components/buttons/switch-toggle';

const CodiSavePage = () => {
	const navigate = useNavigate();
	// 상태 관리
	const [codiItems, setCodiItems] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [description, setDescription] = useState('');
	const [isPublic, setIsPublic] = useState(true);

	useEffect(() => {
		// 로컬 스토리지에서 코디 아이템 정보 가져오기
		const savedItems = localStorage.getItem('codiItems');
		if (savedItems) {
			setCodiItems(JSON.parse(savedItems));
		}
		setIsLoading(false);
	}, []);

	const handleBackClick = () => {
		if (window.history.length > 1) {
			navigate(-1);
		} else {
			navigate('/');
		}
	};

	// 여기서부터는 코디 저장 로직인데 여기는 추후 api와 연결해야 한다.
	const handleComplete = () => {
		const codiData = {
			items: codiItems,
			description,
			isPublic,
			createdAt: new Date().toISOString(),
		};

		// 서버에 저장해야하지만 우선은 로컬 스토리지에 저장
		localStorage.setItem('savedCodi', JSON.stringify(codiData));

		// 완료 후 홈으로 이동
		alert('코디가 저장되었습니다!');
		navigate('/');
	};

	return (
		<div className='max-w-md mx-auto h-screen flex flex-col bg-white'>
			<Header
				showBack={true}
				badgeText='완료'
				onBackClick={handleBackClick}
				onBadgeClick={handleComplete}
			/>

			<div className='flex-1 flex flex-col overflow-auto'>
				{isLoading ? (
					<div className='flex-1 flex items-center justify-center'>
						<p className='text-description'>로딩 중...</p>
					</div>
				) : (
					<>
						{/* 코디 결과 이미지 */}
						<div className='bg-gray-50'>
							<ResultCodiCanvas items={codiItems} />
						</div>

						{/* 코디 설명 및 공개 설정 */}
						<div className='p-4 flex-1'>
							<div className='mb-6'>
								<label
									htmlFor='description'
									className='block text-sm font-medium text-gray-700 mb-2 text-left'
								>
									코디 설명
								</label>
								<InputField
									type='text'
									placeholder='어떤 코디인가요?'
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</div>

							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium text-gray-700'>
									다른 사람에게 공개
								</span>
								<SwitchToggle
									checked={isPublic}
									onToggle={() => setIsPublic(!isPublic)}
								/>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default CodiSavePage;
