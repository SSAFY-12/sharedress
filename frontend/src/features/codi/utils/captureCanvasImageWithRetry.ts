import { captureCanvasImage } from '@/features/codi/api/codiApi';

export const captureCanvasImageWithRetry = async (
	element: HTMLElement,
	maxAttempts: 2,
	delayMs = 200,
): Promise<string> => {
	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			const base64 = await captureCanvasImage(element);
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
