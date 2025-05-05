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

interface SaveCodiRequest {
	description: string;
	isPublic: boolean;
	isTemplate: boolean;
	items: CodiItem[];
}

export const myCodiSaveApi = async (data: SaveCodiRequest) => {
	const response = await client.post('api/coordinations/my', data);
	return response.data;
};
