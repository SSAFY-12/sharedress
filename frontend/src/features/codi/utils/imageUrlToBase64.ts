import { client } from '@/api/client';

export const imageUrlToBase64 = async (imageUrl: string): Promise<string> => {
	const encodedUrl = encodeURIComponent(imageUrl);
	const response = await client.get('/api/html2canvas/proxy', {
		params: {
			url: encodedUrl,
		},
	});

	const { content } = response.data;

	if (!content?.base64 || !content?.mimeType) {
		throw new Error('응답 형식 오류');
	}

	return `data:${content.mimeType};base64,${content.base64}`;
};
