// Google Analytics 이벤트 추적을 위한 타입 정의
declare global {
	interface Window {
		gtag: (
			command: string,
			action: string,
			params?: {
				page_path?: string;
				page_title?: string;
				[key: string]: any;
			},
		) => void;
	}
}

// 페이지 뷰 추적
export const trackPageView = (path: string, title: string) => {
	if (typeof window.gtag === 'function') {
		window.gtag('event', 'page_view', {
			page_path: path,
			page_title: title,
		});
	}
};

// 사용자 행동 추적을 위한 이벤트 추적
export const trackEvent = (
	eventName: string,
	eventParams?: {
		[key: string]: any;
	},
) => {
	if (typeof window.gtag === 'function') {
		window.gtag('event', eventName, eventParams);
	}
};

// 사용자 클릭 추적
export const trackClick = (elementName: string, elementId?: string) => {
	if (typeof window.gtag === 'function') {
		window.gtag('event', 'click', {
			element_name: elementName,
			element_id: elementId,
		});
	}
};

// 사용자 스크롤 추적
export const trackScroll = (scrollDepth: number) => {
	if (typeof window.gtag === 'function') {
		window.gtag('event', 'scroll', {
			scroll_depth: scrollDepth,
		});
	}
};

// 사용자 검색 추적
export const trackSearch = (searchTerm: string) => {
	if (typeof window.gtag === 'function') {
		window.gtag('event', 'search', {
			search_term: searchTerm,
		});
	}
};
