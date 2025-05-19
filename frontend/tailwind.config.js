/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			backgroundImage: {
				'auth-bg': "url('@/assets/login/clothImg.png')",
			},
			fontFamily: {
				main: ['Pretendard', 'sans-serif'],
				logo: ['WatermelonSalad', 'sans-serif'],
			},
			fontSize: {
				categoryButton: ['14px', { fontWeight: '500' }],
				topHeader: ['18px', { fontWeight: '500' }],
				title: ['20px', { fontWeight: '600' }],
				logo: ['18px', { fontWeight: '500' }],
				default: ['16px', { fontWeight: '400' }],
				bigTitle: ['24px', { fontWeight: '500' }],
				titleThin: ['20px', { fontWeight: '400' }],
				button: ['18px', { fontWeight: '500' }],
				description: ['14px', { fontWeight: '400' }],
				smallButton: ['16px', { fontWeight: '500' }],
				smallDescription: ['12px', { fontWeight: '500' }],
				navSelected: ['10px', { fontWeight: '600' }],
				navUnselected: ['10px', { fontWeight: '500' }],
			},
			colors: {
				regular: '#3A3636',
				low: '#6B6767',
				background: '#F8F7F7',
				white: '#FFFFFF',
				light: '#E6E5E5',
				description: '#B4B2B1',
				descriptionColor: '#B4B2B1', //색상이랑 글씨 모두 description 으로 존재?
				brownButton: '#584B4B',
				main: '#3A3636',
				modify: '#3B98DF',
				delete: '#E36969',
				success: '#2079FF',
				alarm: '#F2754F',
			},
		},
	},
	plugins: [require('tailwind-scrollbar-hide')],
};
