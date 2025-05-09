import PlatFormBlock from '@/features/regist/components/PlatFormBlock';

const RegistScanPage = () => {
	const musinsa = () => {
		window.open('https://www.musinsa.com/mypage/orders', '_blank');
	};
	const two9cm = window.open('https://www.29cm.co.kr/mypage/orders', '_blank');
	const able = window.open('https://m.a-bly.com/mypage/orders', '_blank');
	const kream = window.open('https://kream.co.kr/mypage/orders', '_blank');

	return (
		<div className='flex-1 w-full h-full flex flex-col justify-start items-center py-5 px-4 gap-5'>
			<PlatFormBlock
				title='무신사'
				description='https://www.musinsa.com'
				image='musinsa.png'
			/>
			<PlatFormBlock
				title='29CM'
				description='https://www.29cm.co.kr'
				image='29cm.png'
			/>
			<PlatFormBlock
				title='에이블리'
				description='https://m.a-bly.com'
				image='ably.png'
			/>
			<PlatFormBlock
				title='크림'
				description='https://kream.co.kr'
				image='kream.png'
			/>
		</div>
	);
};

export default RegistScanPage;
