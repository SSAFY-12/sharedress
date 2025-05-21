import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClothesRegister from '@/features/onboarding/components/ClothRegister';
import MyCloset from '@/features/onboarding/components/Mycloset';
import ActionMenu from '@/features/onboarding/components/ActionMenu';
import ShareOutfit from '@/features/onboarding/components/ShareOutfit';
import FriendRequest from '@/features/onboarding/components/FriendRequest';
import OutfitStyling from '@/features/onboarding/components/OutfitStyling';

const OnboardingPage = () => {
	const [currentScreen, setCurrentScreen] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		// 이미 온보딩을 완료한 사용자인지 확인
		const hasCompletedOnboarding = localStorage.getItem(
			'hasCompletedOnboarding',
		);
		if (hasCompletedOnboarding === 'true') {
			navigate('/mypage');
		}
	}, [navigate]);

	const screens = [
		{
			id: 'action-menu',
			component: <ActionMenu key='action-menu' />,
			title: '옷장 & 코디',
			subtitle: '플러스 버튼을 눌러 원하는 기능을 선택하세요',
		},
		{
			id: 'clothes-register',
			component: <ClothesRegister key='clothes-register' />,
			title: '옷 등록하기',
			subtitle: '다양한 방법으로 간편하게 등록해보세요',
		},
		{
			id: 'my-closet',
			component: <MyCloset key='my-closet' />,
			title: '마이 옷장',
			subtitle: '나만의 옷장과 코디를 한눈에 볼 수 잇어요',
		},
		{
			id: 'outfit-styling',
			component: <OutfitStyling key='outfit-styling' />,
			title: '코디 꾸미기',
			subtitle: '나만의 스타일을 완성해보세요',
		},
		{
			id: 'friend-request',
			component: <FriendRequest key='friend-request' />,
			title: '친구에게 코디 요청',
			subtitle: '함께 스타일링하고 소통하세요',
		},
		{
			id: 'share-outfit',
			component: <ShareOutfit key='share-outfit' />,
			title: '코디 공유하기',
			subtitle: '링크로 비회원 친구에게도 코디 추천을 요청해보세요',
		},
	];

	const nextScreen = () => {
		setCurrentScreen((prev) => (prev === screens.length - 1 ? prev : prev + 1));
	};

	const prevScreen = () => {
		setCurrentScreen((prev) => (prev === 0 ? prev : prev - 1));
	};

	const goToScreen = (index: number) => {
		setCurrentScreen(index);
	};

	const handleCompleteOnboarding = () => {
		localStorage.setItem('hasCompletedOnboarding', 'true');
		navigate('/mypage');
	};

	return (
		<div className='flex h-screen w-full flex-col items-center justify-center bg-gray-100 p-4'>
			<div className='flex w-full max-w-md flex-col items-center'>
				<div className='mb-4 flex space-x-2'>
					{screens.map((screen) => (
						<button
							key={screen.id}
							className={`h-2 w-2 rounded-full ${
								currentScreen === screens.findIndex((s) => s.id === screen.id)
									? 'bg-gray-800'
									: 'bg-gray-300'
							}`}
							onClick={() =>
								goToScreen(screens.findIndex((s) => s.id === screen.id))
							}
						/>
					))}
				</div>

				<div className='mb-4'>
					<h2 className='text-center text-2xl font-bold'>
						{screens[currentScreen].title}
					</h2>
					<p className='text-center text-gray-600'>
						{screens[currentScreen].subtitle}
					</p>
				</div>

				<div className='mb-4'>{screens[currentScreen].component}</div>

				<div className='flex w-full max-w-md items-center justify-center'>
					<div className='flex space-x-2'>
						{currentScreen > 0 && (
							<button
								className='h-10 px-6 rounded-full border border-gray-800 bg-white text-sm text-gray-800 flex items-center justify-center font-medium'
								onClick={prevScreen}
							>
								이전
							</button>
						)}
						{currentScreen < screens.length - 1 && (
							<button
								className='h-10 px-6 rounded-full border border-gray-800 bg-white text-sm text-gray-800 flex items-center justify-center font-medium'
								onClick={handleCompleteOnboarding}
							>
								건너뛰기
							</button>
						)}
						{currentScreen < screens.length - 1 && (
							<button
								className='h-10 px-6 rounded-full bg-gray-800 text-sm text-white flex items-center justify-center font-medium'
								onClick={nextScreen}
							>
								다음
							</button>
						)}
						{currentScreen === screens.length - 1 && (
							<button
								className='h-10 px-6 rounded-full bg-gray-800 text-sm text-white flex items-center justify-center font-medium'
								onClick={handleCompleteOnboarding}
							>
								시작하기
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default OnboardingPage;
