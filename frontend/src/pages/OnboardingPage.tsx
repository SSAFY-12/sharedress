import { useState } from 'react';
import ClothesRegister from '@/features/onboarding/components/ClothRegister';
import MyCloset from '@/features/onboarding/components/Mycloset';
import ActionMenu from '@/features/onboarding/components/ActionMenu';
import ShareOutfit from '@/features/onboarding/components/ShareOutfit';
import FriendRequest from '@/features/onboarding/components/FriendRequest';

import { ChevronLeft, ChevronRight } from 'lucide-react';

const OnboardingPage = () => {
	const [currentScreen, setCurrentScreen] = useState(0);

	const screens = [
		{
			component: <MyCloset key='my-closet' />,
			title: '마이 옷장',
			subtitle: '나만의 옷장과 코디를 한눈에',
		},
		{
			component: <ClothesRegister key='clothes-register' />,
			title: '옷 등록하기',
			subtitle: '다양한 방법으로 간편하게 등록',
		},
		{
			component: <ActionMenu key='action-menu' />,
			title: '옷장 & 코디',
			subtitle: '원하는 기능을 선택하세요',
		},
		{
			component: <ShareOutfit key='share-outfit' />,
			title: '코디 공유하기',
			subtitle: '링크로 코디 추천을 요청해보세요',
		},
		{
			component: <FriendRequest key='friend-request' />,
			title: '친구에게 코디 요청',
			subtitle: '함께 스타일링하고 소통하세요',
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

	return (
		<main className='flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4'>
			<div className='mb-4 flex space-x-2'>
				{screens.map((_, index) => (
					<button
						key={index}
						className={`h-2 w-2 rounded-full ${
							currentScreen === index ? 'bg-gray-800' : 'bg-gray-300'
						}`}
						onClick={() => goToScreen(index)}
					/>
				))}
			</div>

			<div className='mb-6'>
				<h2 className='text-center text-2xl font-bold'>
					{screens[currentScreen].title}
				</h2>
				<p className='text-center text-gray-600'>
					{screens[currentScreen].subtitle}
				</p>
			</div>

			<div className='mb-8'>{screens[currentScreen].component}</div>

			<div className='flex w-full max-w-md items-center justify-between'>
				{currentScreen > 0 ? (
					<button
						className='flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white'
						onClick={prevScreen}
					>
						<ChevronLeft className='h-4 w-4' />
					</button>
				) : (
					<div className='w-10'></div>
				)}

				<div className='flex space-x-2'>
					<button className='rounded-full border border-gray-800 bg-white px-4 py-1 text-sm text-gray-800'>
						건너뛰기
					</button>

					{currentScreen < screens.length - 1 && (
						<button
							className='rounded-full bg-gray-800 px-4 py-1 text-sm text-white'
							onClick={nextScreen}
						>
							다음
						</button>
					)}
				</div>

				{currentScreen < screens.length - 1 ? (
					<button
						className='flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white'
						onClick={nextScreen}
					>
						<ChevronRight className='h-4 w-4' />
					</button>
				) : (
					<div className='w-10'></div>
				)}
			</div>
		</main>
	);
};

export default OnboardingPage;
