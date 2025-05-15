import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/features/social/api/socialApi';

interface PublicLinkResponse {
	content: string;
}

interface DecodePublicLinkResponse {
	content: any;
}

const usePublicLink = () => {
	const { data, isLoading, error } = useQuery<PublicLinkResponse, Error>({
		queryKey: ['publicLink'],
		queryFn: () => publicApi.createPublicLink(),
	});

	return {
		publicLink: data?.content,
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
		isDecodeLoading: isLoading,
		decodeError: error,
	};
};

export { usePublicLink, useDecodePublicLink };
