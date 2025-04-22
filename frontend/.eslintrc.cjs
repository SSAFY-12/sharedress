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
		'check-file',
	],
	// 자기자신을 검증하지 않도록
	ignorePatterns: [
		'.eslintrc.cjs',
		'vite.config.ts',
		'tailwind.config.js',
		'postcss.config.js',
	],
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
		'@typescript-eslint/no-unused-vars': 'warn', // TypeScript용 미사용 변수 검사
		'no-unused-vars': 'off', // 기본 규칙 비활성화 (TypeScript 규칙과 충돌 방지)

		'react-hooks/exhaustive-deps': 'error', // useEffect 등 훅 의존성 검사

		'no-undef': 'error', // 정의되지 않은 변수 사용 금지
		'react/jsx-no-target-blank': 'error', // target="_blank" 보안 이슈 방지
		'react/no-array-index-key': 'warn', // 배열 인덱스를 key로 사용 경고

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
		// 파일명/폴더명 규칙
		'check-file/filename-naming-convention': [
			'error',
			{
				'src/components/**/*UI.tsx': 'PASCAL_CASE',
				'src/features/**/*Feat.tsx': 'PASCAL_CASE',
				'src/api/**/*Api.ts': 'CAMEL_CASE',
				'src/api/**/*Api.type.ts': 'PASCAL_CASE',
				'src/hooks/**/use*Api.ts': 'CAMEL_CASE',
				'src/services/**/*ApiService.ts': 'CAMEL_CASE',
				'src/utils/**/*Util.ts': 'CAMEL_CASE',
				'src/constants/**/*Const.ts': 'SCREAMING_SNAKE_CASE',
				'src/__tests__/**/*.test.{tsx,ts}': 'CAMEL_CASE',
				'src/pages/**/*Page.tsx': 'PASCAL_CASE',
				'src/layouts/**/*Layout.tsx': 'PASCAL_CASE',
				'src/styles/**/*Styles.ts': 'CAMEL_CASE',
				'src/**/*.stories.tsx': 'CAMEL_CASE',
			},
		],
		'check-file/folder-naming-convention': [
			'error',
			{
				'src/components/**/': 'KEBAB_CASE',
				'src/features/**/': 'CAMEL_CASE',
				'src/api/**/': 'KEBAB_CASE',
				'src/services/**/': 'KEBAB_CASE',
				'src/hooks/**/': 'KEBAB_CASE',
				'src/constants/**/': 'KEBAB_CASE',
				'src/pages/**/': 'KEBAB_CASE',
				'src/layouts/**/': 'KEBAB_CASE',
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
