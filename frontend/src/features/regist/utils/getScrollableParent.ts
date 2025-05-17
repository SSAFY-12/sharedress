export const getScrollableParent = (
	element: HTMLElement | null,
): HTMLElement | Window => {
	let el = element;
	while (el && el !== document.body) {
		const style = window.getComputedStyle(el);
		const { overflowY } = style;
		const canScroll = el.scrollHeight > el.clientHeight;
		if ((overflowY === 'auto' || overflowY === 'scroll') && canScroll) {
			return el;
		}
		el = el.parentElement;
	}
	return window;
};
