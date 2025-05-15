import { client } from '@/api/client';

export interface Profile {
	id: number;
	email: string;
	nickname: string;
	code: string;
	profileImage: string;
	oneLiner: string;
}

export interface MemberProfile extends Profile {
	isPublic: boolean;
	notificationStatus: boolean;
}

export interface ClosetItem {
	id: number;
	image: string;
	name: string;
	brandName: string;
	shopName: string;
	isPublic: boolean;
	createdAt: string;
	libraryId: number;
}

export type CoordinationScope = 'CREATED' | 'RECOMMENDED';

export interface CoordinationItem {
	id: number;
	title: string;
	description: string;
	isPublic: boolean;
	isTemplate: boolean;
	thumbnail: string;
	createdAt: string;
}

export interface ClothDetail {
	id: number;
	image: string;
	name: string;
	brand: {
		id: number;
		name: string;
	};
	shopName: string;
	color: {
		id: number;
		name: string;
		hexCode: string;
	};
	category: {
		id: number;
		name: string;
	};
	isPublic: boolean;
	createdAt: string;
}

export interface CoordinationDetailItem {
	id: number;
	image: string;
	position: {
		x: number;
		y: number;
		z: number;
	};
	scale: number;
	rotation: number;
}

export interface CoordinationDetail {
	id: string;
	title: string;
	description: string;
	isPublic: boolean;
	isTemplate: boolean;
	thumbnail: string;
	items: CoordinationDetailItem[];
	creator: {
		id: number;
		nickname: string;
		profileImage: string;
	};
	owner: {
		id: number;
		nickname: string;
		profileImage: string;
	};
	createdAt: string;
}

export interface CoordinationComment {
	id: number;
	content: string;
	depth: number;
	parentId: number;
	creator: {
		id: number;
		nickname: string;
		profileImage: string;
	};
	createdAt: string;
}

export interface CopeidCoordination {
	id: number;
	title: string;
	description: string;
	isPublic: boolean;
	isTemplate: boolean;
	thumbnail: string;
	createdAt: string;
}

interface PostCommentParams {
	coordinationId: number;
	content: string;
}

interface UpdateClothRequest {
	name: string;
	brandId: number;
	categoryId: number;
	colorId: number;
	isPublic: boolean;
}

export const getMyProfile = async (): Promise<MemberProfile> => {
	const response = await client.get('/api/members/profile/my');
	return response.data.content;
};

export const fetchCloset = async ({
	memberId,
	categoryId,
}: {
	memberId: number;
	categoryId?: number;
}) => {
	const response = await client.get(`/api/closet/${memberId}`, {
		params: categoryId !== undefined ? { categoryId } : undefined,
	});
	return response.data.content as ClosetItem[];
};

export const getCoordinationList = async (
	memberId: number,
	scope: CoordinationScope,
) => {
	const response = await client.get('/api/coordinations', {
		params: {
			memberId,
			scope,
		},
		withCredentials: true, //쿠키 전송 추가
	});
	return response.data.content as CoordinationItem[];
};

export const fetchClothDetail = async (clothId: number) => {
	const response = await client.get(`/api/closet/clothes/${clothId}`);
	return response.data.content as ClothDetail;
};

export const fetchCoordinationDetail = async (coordinationId: number) => {
	const response = await client.get(`/api/coordinations/${coordinationId}`, {
		withCredentials: true, //쿠키 전송 추가
	});
	return response.data.content as CoordinationDetail;
};

export const fetchCoordinationComments = async (coordinationId: number) => {
	const response = await client.get(
		`/api/coordinations/${coordinationId}/comments`,
		{
			withCredentials: true, //쿠키 전송 추가
		},
	);
	console.log(response.data.content);
	return response.data.content as CoordinationComment[];
};

export const postCoordinationComment = async ({
	coordinationId,
	content,
}: PostCommentParams) => {
	const response = await client.post(
		`/api/coordinations/${coordinationId}/comments`,
		{
			content,
		},
		{
			withCredentials: true, //쿠키 전송 추가
		},
	);
	return response.data.content;
};

export const postCopyCoordination = async (coordinationId: string) => {
	const response = await client.post(
		`/api/coordinations/${coordinationId}/copy`,
		{
			withCredentials: true, //쿠키 전송 추가
		},
	);
	return response.data.content as CopeidCoordination;
};

export const deleteCloth = async (closetClothesId: number) => {
	console.log(closetClothesId);
	const response = await client.delete(
		`/api/closet/clothes/${closetClothesId}`,
	);
	return response.data;
};

export const deleteCoordination = async (coordinationId: number) => {
	const response = await client.delete(`/api/coordinations/${coordinationId}`, {
		withCredentials: true, //쿠키 전송 추가
	});
	return response.data;
};

export const deleteCoordinationComment = async ({
	coordinationId,
	commentId,
}: {
	coordinationId: number;
	commentId: number;
}) => {
	const response = await client.delete(
		`/api/coordinations/${coordinationId}/comments/${commentId}`,
		{
			withCredentials: true, //쿠키 전송 추가
		},
	);
	return response.data;
};

export const fetchFriendProfile = async (
	memberId: number,
): Promise<Profile> => {
	const response = await client.get(`api/members/${memberId}/profile`);
	return response.data.content;
};

export const fetchRecommendedToFriend = async (memberId: number) => {
	const response = await client.get(`/api/coordinations/friends/${memberId}`, {
		withCredentials: true, //쿠키 전송 추가
	});
	return response.data.content as CoordinationItem[];
};

export const updateCloth = async (
	closetClothesId: number,
	data: UpdateClothRequest,
) => {
	const response = await client.put(
		`api/closet/clothes/${closetClothesId}`,
		data,
	);
	console.log(response.data.content);
	return response.data.content;
};

export const fetchBrandsByKeyword = async (keyword: string) => {
	const response = await client.get('/api/clothes/brands', {
		params: { keyword },
	});
	return response.data.content;
};

export const fetchColors = async () => {
	const response = await client.get('/api/clothes/colors');
	return response.data.content as {
		id: number;
		name: string;
		hexCode: string;
	}[];
};

export const fetchCategories = async () => {
	const response = await client.get('/api/clothes/categories');
	return response.data.content as {
		id: number;
		name: string;
	}[];
};

export const updateCodiPublicStatus = async (
	coordinationId: number,
	isPublic: boolean,
) => {
	const response = await client.patch(
		`/api/coordinations/${coordinationId}`,
		{
			isPublic,
		},
		{
			withCredentials: true, //쿠키 전송 추가
		},
	);
	return response.data;
};
