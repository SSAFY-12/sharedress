import html2canvas from 'html2canvas';

const canvasToImage = async (
	element: HTMLElement,
	fileName: 'codi-thumbnail.png',
): Promise<File | null> => {
	if (!element) return null;

	const canvas = await html2canvas(element, {
		useCORS: true,
		backgroundColor: null,
		scale: 2,
	});

	return new Promise((resolve) => {
		canvas.toBlob((blob) => {
			if (!blob) return resolve(null);
			const file = new File([blob], fileName, {
				type: 'image/png',
			});
			resolve(file);
		}, 'image/png');
	});
};

export default canvasToImage;
