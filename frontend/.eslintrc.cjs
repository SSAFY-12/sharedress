module.exports = {
	root: true, // 이 파일을 프로젝트의 ESLint 설정의 최상위(root)로 지정
	env: {
		browser: true, // 브라우저 환경 전역 변수 사용 가능
		node: true, // Node.js 환경 전역 변수 사용 가능
		es2021: true, // ES2021 문법 지원
	},
	extends: [
		'eslint:recommended', // ESLint 기본 권장 규칙
		'plugin:react/recommended', // React 권장 규칙
		'plugin:@typescript-eslint/recommended', // TypeScript 권장 규칙
		'plugin:prettier/recommended', // Prettier와 충돌하는 ESLint 규칙 비활성화 + Prettier 적용
	],
	parser: '@typescript-eslint/parser', // TypeScript 코드 파싱을 위한 파서 지정
	parserOptions: {
		ecmaFeatures: { jsx: true }, // JSX 문법 지원
		ecmaVersion: 'latest', // 최신 ECMAScript 문법 지원
		sourceType: 'module', // ES 모듈(import/export) 사용
		tsconfigRootDir: __dirname, // 이 줄 추가
		project: ['./tsconfig.app.json', './tsconfig.node.json'],
	},
	plugins: [
		'react', // React 관련 규칙
		'@typescript-eslint', // TypeScript 관련 규칙
		'react-hooks', // React Hooks 관련 규칙
		'tailwindcss', // Tailwind CSS 클래스 관련 규칙
		'react-refresh', // React Fast Refresh 관련 규칙
		'no-relative-import-paths', // 상대경로 import 제한 규칙
		'check-file', // 파일/폴더명 네이밍 규칙
	],
	// ESLint가 검사하지 않을 파일(설정 파일 등) 명시
	ignorePatterns: [
		'.eslintrc.cjs', // 이 ESLint 설정 파일
		'vite.config.ts', // Vite 설정 파일
		'tailwind.config.js', // Tailwind 설정 파일
		'postcss.config.js', // PostCSS 설정 파일
	],
	settings: {
		react: { version: 'detect' }, // React 버전 자동 감지
		tailwindcss: {
			callees: ['cn', 'clsx', 'twMerge'], // Tailwind 클래스 유효성 검사 함수
			config: './tailwind.config.js', // Tailwind 설정 파일 위치
		},
	},
	rules: {
		// --- 공통 규칙 ---
		'react/react-in-jsx-scope': 'off', // React 17+에서는 import 필요 없음

		// TypeScript 미사용 변수 경고 (기본 no-unused-vars는 off)
		'@typescript-eslint/no-unused-vars': 'warn',
		'no-unused-vars': 'off',

		// React Hooks 의존성 배열 검사 (useEffect 등)
		'react-hooks/exhaustive-deps': 'error',

		// 정의되지 않은 변수 사용 금지
		'no-undef': 'error',

		// target="_blank" 사용 시 rel="noopener noreferrer" 필수 (보안)
		'react/jsx-no-target-blank': 'error',

		// 배열 인덱스를 key로 사용 경고 (React 성능/버그 예방)
		'react/no-array-index-key': 'warn',

		// --- 네이밍 컨벤션 비활성화 ---
		'@typescript-eslint/naming-convention': 'off',

		'@typescript-eslint/no-explicit-any': 'off', // any 타입 허용

		// --- 파일/폴더명 규칙 (check-file 플러그인) ---
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

		// --- 함수/화살표 함수 스타일 ---
		'func-style': ['error', 'expression'], // 함수 선언 대신 화살표 함수 사용 강제
		'prefer-arrow-callback': [
			'error',
			{ allowNamedFunctions: false }, // 콜백에서 일반 함수 금지
		],
		'arrow-body-style': ['error', 'as-needed'], // 불필요한 중괄호 제거

		// --- 이벤트 핸들러 네이밍 ---
		'react/jsx-handler-names': [
			'error',
			{
				eventHandlerPrefix: 'handle', // 핸들러 함수는 handle로 시작
				eventHandlerPropPrefix: 'on', // prop은 on으로 시작
			},
		],

		// --- 상대경로 import 제한 ---
		'no-relative-import-paths/no-relative-import-paths': [
			'warn',
			{ allowSameFolder: true, rootDir: 'src', prefix: '@' }, // @ 별칭 사용 권장
		],

		// --- 구조분해 할당 권장 ---
		'prefer-destructuring': [
			'error',
			{
				VariableDeclarator: { array: false, object: true }, // 변수 선언 시 객체 구조분해 권장
				AssignmentExpression: { array: false, object: false },
			},
		],
	},
	overrides: [
		{
			files: ['src/main.tsx'],
			rules: {
				'@typescript-eslint/no-non-null-assertion': 'off',
			},
		},
		// 필요하다면 다른 파일도 추가 가능
	],
};
