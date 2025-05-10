import { client } from '@/api/client';
// API 응답 타입 정의
export interface LibraryClothes {
	id: number;
	name: string;
	brandName: string;
	image: string;
	createdAt: string;
	categoryId: number;
}

export interface Page {
	size: number;
	hasNext: boolean;
	cursor: number;
}

export interface Status {
	code: string;
	message: string;
}

export interface LibraryResponse {
	status: Status;
	content: LibraryClothes[];
	pagination: Page;
}

// API 요청 파라미터 타입 정의
export interface LibraryRequestParams {
	keyword?: string;
	categoryId?: number;
	shopId?: string;
	cursor?: number;
	size?: number;
}

export const LibraryApis = {
	// --------------------라이브러리 옷 조회------------------------
	getClothes: async (
		params: LibraryRequestParams,
	): Promise<LibraryResponse> => {
		const response = await client.get('/api/clothes', {
			params: {
				keyword: params.keyword,
				categoryId: params.categoryId,
				shopId: params.shopId,
				cursor: params.cursor,
				size: params.size || 12,
			},
		});
		return response.data;
	},
	// --------------------라이브러리 옷 등록------------------------
	registCloth: async (itemId: number) => {
		const response = await client.post('/api/closet/clothes/library', {
			itemId: itemId,
		});
		console.log(itemId, 'request');
		console.log(response.data, 'response');
		return response.data;
	},
};

export const ClosetApis = {
	// --------------------옷장 옷 조회------------------------
	deleteCloth: async (closetClothesId: number) => {
		const response = await client.delete(
			`/api/closet/clothes/${closetClothesId}`,
		);
		return response.data;
	},
};
