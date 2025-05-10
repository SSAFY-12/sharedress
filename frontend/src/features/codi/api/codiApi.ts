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
	title: string;
	description: string;
	isPublic: boolean;
	isTemplate: boolean;
	items: CodiItem[];
}

export const myCodiSaveApi = async (data: SaveCodiRequest) => {
	const response = await client.post('api/coordinations/my', data);
	return response.data;
};

export const uploadCodiImage = async (
	coordinationsId: number,
	file: File,
): Promise<string> => {
	const formData = new FormData();
	formData.append('file', file);

	const response = await client.patch(
		`api/coordinations/${coordinationsId}/thumbnail`,
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		},
	);

	return response.data.content.thumbnail;
};
