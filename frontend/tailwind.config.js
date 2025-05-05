/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			backgroundImage: {
				'auth-bg': "url('@/assets/login/clothImg.png')",
			},
			fontFamily: {
				logo: ['WatermelonSalad', 'sans-serif'],
			},
			fontSize: {
				categoryButton: '14px',
				topHeader: '18px',
				title: '20px',
				logo: '18px',
				default: '16px',
				bigTitle: '24px',
				titleThin: '20px',
				button: '18px',
				description: '14px',
				smallButton: '16px',
				smallDescription: '12px',
				navSelected: '10px',
				navUnselected: '10px',
			},
			colors: {
				regular: '#3A3636',
				low: '#6B6767',
				background: '#F8F7F7',
				white: '#FFFFFF',
				light: '#E6E5E5',
				description: '#B4B2B1',
				brownButton: '#584B4B',
				main: '#3A3636',
				modify: '#3B98DF',
				delete: '#E36969',
			},
		},
	},
	plugins: [],
};
