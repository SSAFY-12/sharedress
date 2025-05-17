import { client } from '@/api/client';
import { replaceImageWithBase64 } from '@/features/codi/utils/replaceImageWithBase64';
import html2canvas from 'html2canvas';
import { waitAllImagesLoaded } from '@/features/codi/utils/watiForAllImages';

interface Position {
	x: number;
	y: number;
	z: number;
}

interface CodiItem {
	id: number;
	position: Position;
	scale: number;
	rotation: number;
}

export interface SaveCodiRequest {
	title: string;
	description: string;
	isPublic?: boolean;
	isTemplate: boolean;
	items: CodiItem[];
}

export const myCodiSaveApi = async (data: SaveCodiRequest) => {
	const response = await client.post('api/coordinations/my', data);
	return response.data;
};

export const recommendedCodiSaveApi = async (
	friendId: string,
	data: Omit<SaveCodiRequest, 'isPublic'>,
) => {
	const response = await client.post(
		`api/coordinations/friends/${friendId}`,
		data,
	);
	return response.data;
};

export const captureCanvasImage = async (
	element: HTMLElement,
): Promise<string> => {
	await waitAllImagesLoaded(element);
	await replaceImageWithBase64(element);
	await new Promise((r) =>
		requestAnimationFrame(() => requestAnimationFrame(r)),
	);
	if (element.clientWidth === 0 || element.clientHeight === 0) {
		throw new Error('캔버스 요소가 렌더링되지 않았습니다.');
	}
	const canvas = await html2canvas(element, {
		useCORS: true,
		scale: 4,
		width: element.clientWidth,
		height: element.clientHeight,
		backgroundColor: null,
	});
	const base64 = canvas.toDataURL('image/png');
	if (!base64.startsWith('data:image/') || base64.length < 1000) {
		throw new Error('캔버스 이미지 변환 실패');
	}
	return base64;
};

export const uploadCodiThumbnail = async (
	coordinationId: number,
	file: File,
) => {
	const formData = new FormData();
	formData.append('thumbnail', file);
	const response = await client.patch(
		`api/coordinations/${coordinationId}/thumbnail`,
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		},
	);
	return response.data.content;
};
