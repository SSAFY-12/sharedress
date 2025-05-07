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
