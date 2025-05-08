import client from '@/api/client';

export interface MemberProfile {
	id: number;
	email: string;
	nickname: string;
	code: string;
	profileImage: string;
	oneLiner: string;
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
	brandName: string;
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
	});
	return response.data.content as CoordinationItem[];
};

export const fetchClothDetail = async (clothId: number) => {
	const response = await client.get(`/api/closet/clothes/${clothId}`);
	return response.data.content as ClothDetail;
};

export const fetchCoordinationDetail = async (coordinationId: number) => {
	const response = await client.get(`/api/coordinations/${coordinationId}`);
	return response.data.content as CoordinationDetail;
};

export const fetchCoordinationComments = async (coordinationId: number) => {
	const response = await client.get(
		`/api/coordinations/${coordinationId}/comments`,
	);
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
	);
	return response.data.content;
};

export const postCopyCoordination = async (coordinationId: string) => {
	const response = await client.post(
		`/api/coordinations/${coordinationId}/copy`,
	);
	return response.data.content as CopeidCoordination;
};
