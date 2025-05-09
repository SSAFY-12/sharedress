import React, { useRef, useEffect, useState } from 'react';

export default function RegistTestPage() {
	const popupRef = useRef<Window | null>(null);
	const [data, setData] = useState<any>(null);

	// 메시지 리스너
	useEffect(() => {
		const handleMessage = (e: MessageEvent) => {
			// ※ 실제 서비스에선 e.origin 검사 필수!
			console.log('받은 객체:', e.data);
			setData(e.data);
		};
		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	}, []);
	const musinsa = 'https://www.musinsa.com/mypage/orders';
	const two9cm = 'https://www.29cm.co.kr/mypage/orders';
	const able = 'https://m.a-bly.com/mypage/orders';
	const kream = 'https://kream.co.kr/mypage/orders';

	// 팝업 열기
	const openPopup = () => {
		console.log('팝업 열기 시도');
		popupRef.current = window.open(
			'https://www.musinsa.com/order/order-list',
			'_blank',
			'width=600,height=700',
		);
		console.log('팝업 상태:', popupRef.current);
	};

	return (
		<div style={{ padding: 24 }}>
			<h2>window.open + postMessage 테스트</h2>
			<button onClick={openPopup}>팝업 열기</button>

			{data && (
				<>
					<h4>수신된 데이터</h4>
					<pre>{JSON.stringify(data, null, 2)}</pre>
				</>
			)}
		</div>
	);
}
