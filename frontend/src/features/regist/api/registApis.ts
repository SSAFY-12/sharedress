import { client } from '@/api/client';
import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
// API 응답 타입 정의
export interface Clothes extends ClothItem {
	id: number;
	name: string;
	brandName: string;
	image: string;
	createdAt: string;
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

export interface ClothesResponse {
	status: Status;
	content: Clothes[];
	pagination: Page;
}

// API 요청 파라미터 타입 정의
export interface ClothesRequestParams {
	keyword?: string;
	categoryIds?: number;
	shopId?: string;
	cursor?: number;
	size?: number;
}

export const RegistApis = {
	// --------------------라이브러리 옷 조회------------------------
	getClothes: async (
		params: ClothesRequestParams,
	): Promise<ClothesResponse> => {
		const response = await client.get('/api/clothes', {
			params: {
				keyword: params.keyword,
				categoryIds: params.categoryIds,
				shopId: params.shopId,
				cursor: params.cursor,
				size: params.size || 12,
			},
		});
		return response.data;
	},
};
