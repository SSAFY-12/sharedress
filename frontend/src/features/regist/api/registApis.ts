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

interface UploadResponseItem {
	id: number;
	image: string;
}

export interface PrivacyAgreementResponse {
	content: {
		privacyAgreement: boolean;
	};
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

		return response.data;
	},
	// --------------------라이브러리 옷 삭제------------------------
	deleteCloth: async (closetClothesId: number) => {
		const response = await client.delete(
			`/api/closet/clothes/${closetClothesId}`,
		);
		return response.data;
	},
};

import { MyClosetContent } from '@/store/useClosetStore';
import { PhotoClothItem } from '@/features/regist/stores/usePhotoClothStore';
export interface MyClosetResponse {
	status: Status;
	content: MyClosetContent[];
}

export const ClosetApis = {
	// --------------------옷장 옷 조회------------------------
	getMyCloset: async (): Promise<MyClosetResponse> => {
		const response = await client.get('/api/closet/my');
		return response.data;
	},
};

interface PurchaseHistoryRequest {
	shopId: number;
	id: string;
	password: string;
}

interface PurchaseHistoryResponse {
	status: Status;
	content: {
		taskId: string;
		shopId: number;
	};
}

export interface RegistStatusRequest {
	taskId: string;
	shopId: number;
}

export interface RegistStatusResponse {
	status: Status;
	content: {
		completed: boolean;
	};
}

export const ScanApis = {
	// --------------------무신사 옷 등록------------------------
	getPurchaseHistory: async (
		data: PurchaseHistoryRequest,
	): Promise<PurchaseHistoryResponse> => {
		const response = await client.post(
			'/api/closet/clothes/purchase-history',
			data,
		);
		return response.data;
	},
	// --------------------옷 등록 완료여부 조회 ----------------
	getClothRegistrationStatus: async (
		data: RegistStatusRequest,
	): Promise<RegistStatusResponse> => {
		const response = await client.get(
			`/api/closet/clothes/purchase-history/task/${data.taskId}`,
			{
				params: {
					shopId: data.shopId,
				},
			},
		);
		return response.data;
	},
};

// 개인정보 동의 여부 조회
export const getPrivacyAgreement = async (): Promise<boolean> => {
	const res = await client.get<PrivacyAgreementResponse>(
		'/api/members/privacy-agreement',
	);
	return res.data.content.privacyAgreement;
};

// 개인정보 동의 여부 설정
export const setPrivacyAgreement = async (agree: boolean): Promise<boolean> => {
	const res = await client.patch<PrivacyAgreementResponse>(
		'/api/members/privacy-agreement',
		{
			privacyAgreement: agree,
		},
	);
	console.log(res.data, 'res.data');
	return res.data.content.privacyAgreement;
};

export const uploadClothPhotos = async (items: PhotoClothItem[]) => {
	const formData = new FormData();
	items.forEach((item) => {
		formData.append('photos', item.file);
	});

	const response = await client.post<{ content: UploadResponseItem[] }>(
		'/api/closet/clothes/photos/upload',
		formData,
		{
			headers: { 'Content-Type': 'multipart/form-data' },
		},
	);

	return response.data.content;
};

interface CameraStatusResponse {
	status: Status;
	content: {
		completed: boolean;
	};
}
export const getCameraStatus = async (
	taskId: string,
): Promise<CameraStatusResponse> => {
	const response = await client.get<CameraStatusResponse>(
		`/api/closet/clothes/photos/task/${taskId}`,
	);
	return response.data;
};

interface RegisterClothDetailsResponse {
	status: Status;
	content: {
		taskId: string;
	};
}

export const registerClothDetails = async (
	uploaded: UploadResponseItem[],
	items: PhotoClothItem[],
): Promise<RegisterClothDetailsResponse> => {
	const body = uploaded.map((upload, index) => {
		const item = items[index];
		return {
			id: upload.id,
			name: item.name,
			brandId: item.brandId ?? 0,
			categoryId: item.categoryId ?? 0,
			colorId: 1, // 고정
			isPublic: item.isPublic,
		};
	});

	const response = await client.post('/api/closet/clothes/photos/detail', body);

	return response.data;
};

export const fetchRemainingPhotoCount = async (): Promise<number> => {
	const res = await client.get<{ content: { remainingCount: number } }>(
		'/api/closet/clothes/photos/remaining-count',
	);
	console.log('데이터: ', res);
	return res.data.content.remainingCount;
};
