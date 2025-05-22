import { imageUrlToBase64 } from './imageUrlToBase64';

export const replaceImageWithBase64 = async (container: HTMLElement) => {
	const imgElements = container.querySelectorAll('img');

	await Promise.all(
		Array.from(imgElements).map(async (img) => {
			const src = img.getAttribute('src');
			if (!src || src.startsWith('data:')) return;

			try {
				const base64 = await imageUrlToBase64(src);
				img.setAttribute('src', base64);
			} catch (e) {
				console.warn(`이미지 변환 실패: ${src}`, e);
			}
		}),
	);
};
