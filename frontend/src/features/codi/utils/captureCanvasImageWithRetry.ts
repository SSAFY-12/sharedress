import { captureCanvasImage } from '../api/codiApi';

export const captureCanvasImageWithRetry = async (
	element: HTMLElement,
	maxAttempts: 2,
	delayMs = 200,
): Promise<string> => {
	for (let attempt = 1; attempt < maxAttempts; attempt++) {
		try {
			console.log(`[캔버스 캡처 시도] ${attempt}번째`);
			const base64 = await captureCanvasImage(element);
			console.log('[성공] 캔버스 이미지 캡처 완료');
			return base64;
		} catch (error) {
			console.warn(`[실패] ${attempt}번째 캡처 실패`, error);
			if (attempt < maxAttempts) {
				await new Promise((resolve) => setTimeout(resolve, delayMs));
			} else {
				throw new Error('캔버스 이미지 캡처 재시도 실패');
			}
		}
	}
	throw new Error('캔버스 이미지 캡처 실패');
};
