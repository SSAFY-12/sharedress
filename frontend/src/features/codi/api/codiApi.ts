import client from '@/api/client';

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
	console.log(response.data);
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
	console.log(response.data.content);
	return response.data.content;
};
