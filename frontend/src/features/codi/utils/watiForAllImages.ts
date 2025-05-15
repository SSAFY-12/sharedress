export const waitAllImagesLoaded = async (container: HTMLElement) => {
	const imgs = Array.from(container.querySelectorAll('img'));

	if (imgs.length === 0) {
		return Promise.resolve();
	}

	const unloadedImages = imgs.filter(
		(img) => !img.complete || img.naturalWidth === 0,
	);

	if (unloadedImages.length === 0) return Promise.resolve();

	return new Promise((resolve) => {
		let loadedCount = 0;

		unloadedImages.forEach((img) => {
			const check = () => {
				loadedCount++;
				if (loadedCount === unloadedImages.length) {
					resolve(void 0);
				}
			};

			img.addEventListener('load', check, { once: true });
			img.addEventListener('error', check, { once: true });
		});
	});
};
