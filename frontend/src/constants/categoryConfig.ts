export const categoryConfig = [
	'전체',
	'아우터',
	'상의',
	'바지',
	'스커트',
	'신발',
	'기타',
];

// 카테고리 매핑
export const categoryMapping: {
	[key in (typeof categoryConfig)[number]]: number;
} = {
	전체: 0,
	아우터: 2,
	상의: 1,
	하의: 3,
	신발: 4,
	기타: 5,
	스커트: 6,
};
