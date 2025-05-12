import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/features/social/api/socialApi';

interface PublicLinkResponse {
	openLink: string;
}

interface DecodePublicLinkResponse {
	// API 응답 타입에 맞게 정의
	content: any;
}

const usePublicLink = () => {
	const { data, isLoading, error } = useQuery<PublicLinkResponse>({
		queryKey: ['publicLink'],
		queryFn: () => publicApi.createPublicLink(),
	});

	return {
		publicLink: data?.openLink,
		isLoading,
		error,
	};
};

const useDecodePublicLink = (openLink: string) => {
	const { data, isLoading, error } = useQuery<DecodePublicLinkResponse>({
		queryKey: ['decodePublicLink', openLink],
		queryFn: () => publicApi.decodePublicLink(openLink),
		enabled: !!openLink, // openLink가 있을 때만 쿼리 실행
	});

	return {
		decodedData: data?.content,
		isLoading,
		error,
	};
};

export { usePublicLink, useDecodePublicLink };
