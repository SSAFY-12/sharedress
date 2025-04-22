module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: { jsx: true },
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: './tsconfig.app.json', // ✅ 타입 정보 활성화
	},
	plugins: [
		'react',
		'@typescript-eslint',
		'react-hooks',
		'tailwindcss',
		'react-refresh',
		'no-relative-import-paths',
	],
	// 자기자신을 검증하지 않도록
	ignorePatterns: ['.eslintrc.cjs', 'vite.config.ts'],
	settings: {
		react: { version: 'detect' },
		tailwindcss: {
			callees: ['cn', 'clsx', 'twMerge'],
			config: './tailwind.config.js',
		},
	},
	rules: {
		// 공통 규칙
		'react/react-in-jsx-scope': 'off',

		// 네이밍 컨벤션
		'@typescript-eslint/naming-convention': [
			'warn',
			{
				selector: 'variable',
				format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
			},
			{ selector: 'function', format: ['camelCase', 'PascalCase'] },
			{ selector: 'typeLike', format: ['PascalCase'] },
			{ selector: 'class', format: ['PascalCase'] },
			{
				selector: 'variable',
				format: ['UPPER_CASE'],
				modifiers: ['const', 'global'],
			},
			{
				selector: 'function',
				format: ['camelCase'],
				filter: { regex: '^use[A-Z]', match: true },
			},
			{
				selector: 'function',
				format: ['camelCase'],
				filter: { regex: '^with[A-Z]', match: true },
			},
			{
				selector: 'function',
				format: ['camelCase'],
				filter: { regex: '^handle[A-Z].*[A-Z]', match: true },
			},
		],

		// 화살표 함수 강제
		'func-style': ['error', 'expression'],
		'prefer-arrow-callback': [
			'error',
			{
				allowNamedFunctions: false, // 일반 함수 금지
			},
		],
		'arrow-body-style': ['error', 'as-needed'],

		// 이벤트 핸들러 네이밍
		'react/jsx-handler-names': [
			'error',
			{
				eventHandlerPrefix: 'handle',
				eventHandlerPropPrefix: 'on',
			},
		],

		// 상대경로 import 제한
		'no-relative-import-paths/no-relative-import-paths': [
			'warn',
			{ allowSameFolder: true, rootDir: 'src', prefix: '@' },
		],

		// 구조분해 할당
		'prefer-destructuring': [
			'error',
			{
				VariableDeclarator: { array: false, object: true },
				AssignmentExpression: { array: false, object: false },
			},
		],
	},
};
