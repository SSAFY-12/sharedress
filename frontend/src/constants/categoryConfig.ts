export const categoryConfig = [
	'전체',
	'아우터',
	'상의',
	'하의',
	'신발',
	'악세사리',
];

// 카테고리 매핑
export const categoryMapping: {
	[key in (typeof categoryConfig)[number]]: number;
} = {
	전체: 0,
	아우터: 1,
	상의: 2,
	하의: 3,
	신발: 4,
	악세사리: 5,
};
