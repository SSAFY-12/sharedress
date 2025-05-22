export const shareLink = async ({
	url,
	title,
	text,
}: {
	url: string;
	title?: string;
	text?: string;
}) => {
	if (navigator.share) {
		try {
			await navigator.share({ url, title, text });
			return 'shared';
		} catch (err) {
			// 사용자가 취소한 경우 등을 대비
			console.warn('Share cancelled or failed', err);
		}
	} else {
		await navigator.clipboard.writeText(url);
		return 'copied';
	}
};
