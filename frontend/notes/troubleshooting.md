[양식]

- 제목
- 문제상황
- 원인 분석
- 해결방법
- 예시
- 결론 및 정리

---

## [트러블슈팅] React Router에서 children vs 형제 route 구조(2025/05/05-안주민)

### 문제 상황

- `/social`에서는 친구 목록만 보여야 하고,
- `/social/search`에서는 친구 추가(검색) 페이지만 보여야 한다.
- 하지만 children 구조로 라우팅을 구성하면 `/social/search`에서 부모(친구 목록)
  와 자식(친구 추가)이 **동시에** 렌더링되어 원하지 않는 UI가 나타남.

### 원인 분석

- React Router에서 children 구조를 사용하면, 부모 컴포넌트(예: FriendPage)와 자
  식 컴포넌트(예: FriendAddPage)가 **동시에** 렌더링된다.  
  (부모 컴포넌트 내 `<Outlet />` 위치에 자식이 삽입됨)
- 이 구조는 "부모+자식이 함께 보여야 할 때" 적합

### 해결 방법

- **children** 대신 **형제 route**로 분리하여 각각 독립적으로 렌더링되게 한다.

#### 예시 (routes/index.tsx)

```tsx
{
  path: 'social',
  element: <FriendPage />, // 친구 목록만
},
{
  path: 'social/search',
  element: <FriendAddPage />, // 친구 추가(검색)만
},
```

### 결론 및 정리

- **children** 구조: 부모+자식이 동시에 보여야 할 때 사용
- **형제 route** 구조: 각각 독립적으로 보여야 할 때 사용
- 원하는 UI가 "/social"과 "/social/search"에서 완전히 분리되어야 한다면, 반드시
  **형제 route**로 분리할 것

## [트러블슈팅] JWT 토큰 관리 및 인증 유지 트러블슈팅(2025/05/05-안주민)

## 문제상황

- 개발/테스트 환경에서 http/https 혼용 또는 http 환경에서 동작 시 발생하는 인증
  문제
- 브라우저가 http/https를 오가거나 새로고침할 때 메모리 기반(Zustand 등)에 저장
  된 토큰이 소실
- 이로 인해 사용자 인증이 풀리는 현상 발생

## 원인 분석

1. **프로토콜 혼용 문제**

   - http와 https가 혼용되는 환경에서 보안 정책으로 인한 토큰 관리 이슈
   - 브라우저의 보안 정책으로 인해 프로토콜 전환 시 메모리 데이터 초기화

2. **토큰 저장 방식의 한계**
   - 메모리 기반(Zustand) 저장 방식의 경우 새로고침 시 데이터 소실
   - 개발 환경에서의 불편한 사용자 경험 발생

## 해결방법

1. **개발/테스트 환경 (http)**

   - Zustand persist 미들웨어를 사용하여 localStorage에 토큰 임시 저장
   - 개발 편의성 확보를 위한 임시 방편으로 적용

2. **운영 환경 (https)**
   - 메모리 기반(Zustand) 토큰 관리 방식 사용
   - 또는 보안이 중요한 경우 HttpOnly 쿠키 방식으로 전환

## 예시

```typescript
// Zustand store with persist middleware
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
	token: string | null;
	setToken: (token: string | null) => void;
}

const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			setToken: (token) => set({ token }),
		}),
		{
			name: 'auth-storage', // localStorage key
			// 개발 환경에서만 persist 사용
			enabled: process.env.NODE_ENV === 'development',
		},
	),
);
```

## 결론 및 정리

1. **개발/테스트 환경**

   - localStorage persist 방식 사용으로 개발 편의성 확보
   - 보안은 감수하고 개발 효율성 우선

2. **운영 환경**

   - https 환경에서 메모리 기반 토큰 관리
   - 또는 HttpOnly 쿠키 방식으로 전환
   - 보안성 강화를 위한 적절한 토큰 관리 방식 적용

3. **주의사항**
   - 운영 배포 전 반드시 보안 정책에 맞는 방식으로 전환
   - http/https 혼용 환경에서는 적절한 토큰 관리 전략 수립 필요
   - 보안과 사용자 경험의 균형 고려

## 참고사항

- 이 트러블슈팅은 개발 환경에서의 임시 해결책을 제시
- 실제 운영 환경에서는 보안 정책에 맞는 적절한 인증 방식 선택 필요
- 프로젝트의 보안 요구사항에 따라 HttpOnly 쿠키 방식 고려

네! 요청하신 양식에 맞춰서, 이번 웹/모바일 레이아웃 이슈의 근본 원인과 해결 방법
을 정리해드리겠습니다.

---

## [트러블슈팅] 웹/모바일 레이아웃에서 컨테이너 높이 및 내부 스크롤 문제(2025/05/05-안주민)

---

### 문제상황

- 모바일 레이아웃에서는 정상적으로 헤더/푸터가 붙고 내부 스크롤이 잘 동작함.
- 웹(에뮬레이션) 레이아웃에서는 560px 컨테이너가 브라우저 높이를 제대로 채우지못
  하거나, 내부 컨텐츠가 위아래로 붙지 않고, 스크롤이 비정상적으로 동작함.
- 모바일 반응형에서 레이아웃이 깨지는 현상도 발생.

---

### 원인 분석

- Tailwind의 `h-full`은 부모 요소의 높이가 명확히 지정되어 있을 때만 100%로 동작
  함.
- App.tsx에서 560px 컨테이너에 `h-full`을 사용했지만, 부모가 `min-h-screen`이어
  서 실제로는 100% 높이가 보장되지 않음.
- 중첩된 div 구조에서 flex/flex-col, h-full, h-screen 등의 조합이 꼬이면, 내부레
  이아웃이 의도대로 동작하지 않음.
- 모바일 레이아웃과 웹 레이아웃의 구조가 완전히 일치하지 않아, 반응형에서 레이아
  웃이 깨질 수 있음.

---

### 해결방법

1. **부모 컨테이너의 높이 명확히 지정**
   - 560px 컨테이너에 `h-full` 대신 `h-screen` 또는 `h-[80vh]` 등 명확한 높이값
     을 부여.
2. **WebLayout의 최상위 div에 `h-full` 유지**
   - 내부에서 헤더/푸터가 absolute로 붙고, main이 flex-1로 스크롤 영역을 차지하
     도록 함.
3. **불필요한 중첩 div 제거**
   - App.tsx에서 불필요한 flex/flex-col, h-full 중첩을 줄임.
4. **모바일/웹 레이아웃 구조 통일**
   - 모바일과 웹 모두 같은 레이아웃 구조와 스타일을 사용하도록 맞춤.

---

### 예시

**App.tsx**

```jsx
<div className='hidden sm:flex min-h-screen items-center justify-center bg-neutral-900'>
	<div className='w-[560px] h-screen bg-white rounded-xl overflow-hidden shadow-xl'>
		<WebLayout />
	</div>
</div>
```

**WebLayout.tsx**

```tsx
<div className='relative h-full flex flex-col'>
	<header className='absolute top-0 left-0 right-0 bg-white z-10'>
		<Header {...headerProps} />
	</header>
	<main className='flex-1 mt-16 mb-16 overflow-y-auto'>
		<Outlet />
	</main>
	<footer className='absolute bottom-0 left-0 right-0 bg-white z-10'>
		<NavBar />
	</footer>
</div>
```

---

### 결론 및 정리

- 레이아웃 컨테이너의 높이는 반드시 명확하게 지정해야 하며, 내부 컴포넌트는 그높
  이를 상속받아야 한다.
- 모바일/웹 레이아웃 구조를 통일하면 반응형 이슈를 줄일 수 있다.
- Tailwind의 `h-full`은 부모의 높이가 명확할 때만 정상 동작하므로, 항상 부모-자
  식 관계의 높이 지정에 주의해야 한다.

---

## [트러블슈팅] 서버의 requesterId/memberId 혼용으로 인한 타입(id) 통일 문제 및 값 미수신 이슈(2025/05/05-안주민)

### 문제상황

- 서버에서 유저 식별자로 `requesterId`와 `memberId`를 혼용해서 응답함.
- 프론트엔드에서 타입을 단순히 `id`로 통일해서 사용함.
- `user.id`로 값을 받아오려 했으나, 실제 응답에는 `id`가 없고 `memberId` 또는
  `requesterId`만 존재.
- 이로 인해 유저 식별값이 제대로 바인딩되지 않고, 값이 undefined로 나오는 문제가
  발생.

---

### 원인 분석

- 서버에서 일관되지 않은 필드명(`requesterId`, `memberId`) 사용.
- 프론트엔드 타입 정의에서 `id`로 통일하여, 실제 데이터와 타입이 불일치.
- 코드에서 `user.id`로 접근하나, 실제 데이터에는 해당 필드가 없어 값이 undefined
  가 됨.
- 타입과 실제 데이터 구조가 불일치하여, 데이터 바인딩 및 로직에 오류 발생.

---

### 해결방법

1. **타입 정의를 실제 서버 응답에 맞게 명확히 작성**
   - 예시:
     ```ts
     export interface SearchUser {
     	content: {
     		profileImage: string;
     		nickname: string;
     		code: string;
     		relationStatus: RelationStatus;
     		memberId: number; // 서버 응답 필드명 그대로 사용
     	}[];
     }
     ```
2. **코드에서 id 접근 시 실제 필드명 사용**
   - `user.id` 대신 `user.memberId` 또는 `user.requesterId` 등 실제 응답 필드명
     으로 접근.
3. **서버와 협의하여 가능하다면 필드명 통일 요청**
   - 서버에서 일관된 필드명(`id` 등)으로 응답하도록 개선 요청.

---

### 예시

**문제 코드 (초기)**

```ts
// 타입 정의
interface User {
	id: number; // 실제 응답에는 없음
	nickname: string;
	// ...
}

// 데이터 접근
user.id; // undefined
```

**해결 코드 (수정 후)**

```ts
// 타입 정의
interface User {
	memberId: number; // 실제 응답 필드명 사용
	nickname: string;
	// ...
}

// 데이터 접근
user.memberId; // 정상 동작
```

**FriendSearchResultPage.tsx**

```tsx
// 잘못된 예시
key={user.id} // undefined

// 올바른 예시
key={user.memberId}
```

---

### 결론 및 정리

- 서버와 프론트엔드 타입 정의는 반드시 실제 응답 필드명과 일치시켜야 한다.
- 혼용된 필드명(`requesterId`, `memberId`)을 단순히 `id`로 통일하면 데이터 바인
  딩 오류가 발생할 수 있다.
- 타입 정의와 데이터 접근 모두 실제 서버 응답 구조에 맞게 작성해야 하며, 가능하
  다면 서버와 협의하여 필드명을 통일하는 것이 가장 바람직하다.

---

## [트러블슈팅] React 훅 사용 관련 트러블슈팅: 토큰 갱신 로직(2025/05/07-안주민)

### 문제상황

- 토큰 갱신(refresh) 로직이 제대로 동작하지 않음
- 새로고침 시 로그아웃되는 현상 발생
- Network 탭에서 refresh 요청이 보이지 않음

### 원인 분석

1. React 훅 사용 규칙 위반

   - React 훅은 컴포넌트나 다른 훅 내부에서만 사용 가능
   - 인터셉터는 React 컴포넌트 외부에서 실행되므로 훅 사용 불가
   - `useRefresh` 훅을 인터셉터에서 직접 호출하려 했던 것이 문제

2. 토큰 갱신 로직의 구조적 문제
   - `useMutation`을 사용한 토큰 갱신 로직이 컴포넌트 외부에서 실행될 수 없음
   - 인터셉터에서 훅을 사용하려 했던 접근 방식이 잘못됨

### 해결방법

1. `useRefresh.ts` 수정

   ```typescript
   const useRefresh = () => {
   	const { setAccessToken } = useAuthStore();
   	const mutation = useMutation({
   		mutationFn: async () => {
   			console.log('Refreshing token...');
   			const response = await authApi.refresh();
   			return response;
   		},
   		onSuccess: (data) => {
   			setAccessToken(data.content.accessToken);
   		},
   		onError: (error) => {
   			// useAuthStore.getState().logout();
   			// window.location.href = '/auth';
   			return Promise.reject(error);
   		},
   	});
   	return {
   		...mutation,
   		refreshToken: mutation.mutate,
   		refreshTokenAsync: mutation.mutateAsync,
   	};
   };
   ```

2. `client.ts` 인터셉터 수정
   ```typescript
   if (status === 401) {
   	try {
   		const response = await authApi.refresh();
   		const newToken = response.content.accessToken;
   		useAuthStore.getState().setAccessToken(newToken);
   		error.config.headers['Authorization'] = `Bearer ${newToken}`;
   		return axios(error.config);
   	} catch (refreshError) {
   		// useAuthStore.getState().logout();
   		// window.location.href = '/auth';
   		return Promise.reject(refreshError);
   	}
   }
   ```

### 예시

#### 올바른 사용 방법

```typescript
// 컴포넌트 내부에서 사용
const MyComponent = () => {
	const { refreshToken } = useRefresh();
	// refreshToken() 호출 가능
};

// 인터셉터에서는 직접 API 호출
const response = await authApi.refresh();
```

#### 잘못된 사용 방법

```typescript
// 인터셉터에서 훅 사용 (X)
const { mutateAsync } = useRefresh(); // 에러 발생
```

### 결론 및 정리

1. React 훅 사용 규칙

   - 훅은 반드시 React 컴포넌트나 다른 훅 내부에서만 사용
   - 컴포넌트 외부(인터셉터 등)에서는 직접 API 호출 방식 사용

2. 토큰 갱신 로직 분리

   - 컴포넌트 내부: `useRefresh` 훅 사용
   - 인터셉터: `authApi.refresh()` 직접 호출

3. 디버깅 포인트
   - 브라우저 콘솔 로그 확인
   - Network 탭에서 refresh 요청 모니터링
   - 토큰 저장 상태 확인

이러한 구조로 변경함으로써 토큰 갱신 로직이 정상적으로 동작하게 되었습니다.

아래는 이번 토큰 리프레시 문제의 시행착오, 원인, 해결과정, 그리고 코드 예시를
README 스타일로 정리한 예시입니다.

---

## [트러블슈팅] Axios 토큰 리프레시 문제 해결기(2025/05/07-안주민)

### 문제 상황

- 프론트엔드에서 accessToken이 만료되면 `/api/auth/refresh`로 토큰 재발급을 요청
  함.
- **Authorization 헤더**에 accessToken이 정상적으로 포함되어 서버로 전송되고 있
  었음.
- 서버 응답:
  ```json
  { "status": { "code": "401", "message": "토큰이 존재하지 않습니다." } }
  ```
- 이로 인해 401 에러가 반복적으로 발생, 재시도 로직 때문에 서버에 수천 건의 요청
  이 쏟아짐.

---

### 원인 분석

1. **Authorization 헤더 자동 추가**

   - axios 인스턴스의 request 인터셉터가 모든 요청에 accessToken을 Authorization
     헤더로 추가하고 있었음.
   - `/api/auth/refresh` 요청에도 accessToken이 붙어서 서버가 이를 거부(401)함.

2. **서버의 기대값과 불일치**

   - API 문서상 `/api/auth/refresh`는 아무런 헤더나 바디 없이 POST만 하면 됨.
   - 실제로는 Authorization 헤더가 계속 붙어서 요청되고 있었음.

3. **무한 재시도**
   - 401이 발생하면 refresh를 시도하고, refresh도 401이 발생하면 또다시 재시도하
     는 무한루프가 발생.

---

### 해결 방법

#### 1. `/api/auth/refresh` 요청에는 Authorization 헤더를 붙이지 않도록 예외 처리

```ts
client.interceptors.request.use(
	async (config) => {
		// /api/auth/refresh 요청에는 Authorization 헤더를 붙이지 않는다
		if (!config.url?.includes('/api/auth/refresh')) {
			const token = useAuthStore.getState().accessToken;
			if (token) {
				config.headers['Authorization'] = `Bearer ${token}`;
			}
		}
		// Content-Type 설정 등 기타 로직
		return config;
	},
	(error) => Promise.reject(error),
);
```

#### 2. refresh 함수도 헤더 없이 요청

```ts
refresh: async () => {
    const response = await client.post(`/api/auth/refresh`);
    return response.data;
},
```

#### 3. 무한 재시도 방지

```ts
client.interceptors.response.use(
	(response) => response,
	async (error) => {
		const status = error.response?.status;
		const originalRequest = error.config;

		// refresh 요청에서 401이 발생하면 재시도하지 않고 바로 로그아웃 처리
		if (originalRequest.url?.includes('/api/auth/refresh')) {
			// useAuthStore.getState().logout();
			// window.location.href = '/auth';
			return Promise.reject(error);
		}

		// 일반 401 처리 (accessToken 만료 시)
		if (status === 401) {
			try {
				const response = await authApi.refresh();
				const newToken = response.content.accessToken;
				useAuthStore.getState().setAccessToken(newToken);
				originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
				return axios(originalRequest);
			} catch (refreshError) {
				// useAuthStore.getState().logout();
				// window.location.href = '/auth';
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);
```

---

### 결론 및 정리

- **/api/auth/refresh** 요청에는 Authorization 헤더를 붙이지 않아야 한다.
- request 인터셉터에서 예외처리를 통해 불필요한 헤더 추가를 막아야 한다.
- response 인터셉터에서 refresh 요청에 대한 401은 재시도하지 않고 바로 로그아웃
  처리해야 한다.
- 이렇게 하면 401 무한루프와 서버 과부하를 막을 수 있다.

---

### 시행착오 요약

- 처음에는 accessToken을 Authorization에 넣어 refresh 요청을 보냈으나, 서버가 이
  를 거부(401)함.
- API 문서를 재확인하여, refresh 요청에는 아무런 헤더도 필요 없음을 알게 됨.
- 인터셉터에서 예외처리를 추가하여 문제를 해결함.
- 무한 재시도 문제도 함께 방지할 수 있었음.

## [트러블슈팅] 토큰 갱신 및 인증 관련 문제 해결 (2025/05/08-안주민)

### 문제상황

1. 페이지 새로고침 시 인증 상태가 초기화되어 401 Unauthorized 에러 발생
2. 토큰 갱신 과정에서 화면이 깜빡이고 서비스가 끊기는 현상 발생
3. 리프레시 토큰이 쿠키에 있음에도 불구하고 액세스 토큰 갱신이 제대로 이루어지지
   않음

### 원인 분석

1. **초기화 타이밍 문제**

   - 앱 시작 시 여러 API 요청이 동시에 발생
   - 토큰 갱신이 완료되기 전에 다른 API 요청이 실행되어 401 에러 발생
   - React Hook 규칙 위반으로 인한 토큰 검증 로직 실행 순서 문제

2. **토큰 관리 방식의 문제**

   - 액세스 토큰을 메모리에서만 관리하여 페이지 새로고침 시 소실
   - localStorage 사용을 제거하면서 발생한 인증 상태 유지 문제
   - 토큰 갱신 로직이 초기화 상태를 고려하지 않음

3. **React Hook 사용 문제**
   - `useTokenValidation` 훅을 조건부로 호출하여 React Hook 규칙 위반
   - 컴포넌트 외부에서 훅을 사용하려는 시도로 인한 에러 발생

### 해결방법

1. **초기화 상태 관리 추가**

   ```typescript
   interface AuthState {
   	isInitialized: boolean;
   	// ... 기존 상태들
   }
   ```

2. **토큰 검증 로직 개선**

   ```typescript
   useEffect(() => {
   	if (!isInitialized) return;
   	// 토큰 검증 로직
   }, [isInitialized]);
   ```

3. **앱 초기화 로직 수정**
   ```typescript
   useEffect(() => {
   	const init = async () => {
   		await initializeAuth();
   		setIsLoading(false);
   	};
   	init();
   }, []);
   ```

### 예시

```typescript
// App.tsx
export const App = () => {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const init = async () => {
			await initializeAuth();
			setIsLoading(false);
		};
		init();
	}, []);

	if (isLoading) return <div>Loading...</div>;

	return <AppContent />;
};

// useTokenValidation.ts
export const useTokenValidation = () => {
	const { isInitialized } = useAuthStore();

	useEffect(() => {
		if (!isInitialized) return;
		// 토큰 검증 로직
	}, [isInitialized]);
};
```

### 결론 및 정리

1. **보안 강화**

   - 액세스 토큰은 메모리에서 관리
   - 리프레시 토큰은 HttpOnly 쿠키로 안전하게 관리
   - localStorage 사용 제거로 XSS 공격 위험 감소

2. **사용자 경험 개선**

   - 초기화가 완료될 때까지 로딩 화면 표시
   - 토큰 갱신이 완료된 후에 API 요청 시작
   - 서비스 끊김 현상 제거

3. **코드 품질 향상**
   - React Hook 규칙 준수
   - 명확한 초기화 상태 관리
   - 에러 처리 및 로깅 개선

이러한 변경으로 인해 앱의 안정성이 크게 향상되었으며, 사용자 경험도 개선되었습니
다. 특히 토큰 갱신 과정에서 발생하던 서비스 끊김 현상이 해결되었습니다.

## [트러블슈팅] Google 프로필 이미지 429 에러 해결 (2025/05/08-안주민)

### 문제상황

- `FriendListPage.tsx`에서 Google 프로필 이미지를 불러올 때 429 (Too Many
  Requests) 에러 발생
- 동일한 이미지에 대한 반복적인 요청으로 인한 서버 부하 발생
- 이미지 로딩이 느리고 불안정한 현상 발생

### 원인 분석

1. **이미지 캐싱 부재**

   - `UserRowItem` 컴포넌트에서 매번 새로운 이미지 요청 발생
   - 브라우저 캐시를 활용하지 않아 동일 이미지 반복 다운로드

2. **이미지 최적화 부재**
   - Google 프로필 이미지 URL에 크기 파라미터가 없어 원본 크기로 다운로드
   - 불필요하게 큰 이미지 파일로 인한 성능 저하

### 해결방법

1. **이미지 컴포넌트 최적화**

```typescript
// UserRowItem.tsx
const UserRowItem = ({ userAvatar, ...props }) => {
	const [imgError, setImgError] = useState(false);

	return (
		<img
			src={imgError ? '/default-profile.png' : userAvatar}
			onError={() => setImgError(true)}
			alt='프로필 이미지'
			loading='lazy'
			crossOrigin='anonymous'
			referrerPolicy='no-referrer'
			className='w-12 h-12 rounded-full object-cover'
		/>
	);
};
```

2. **이미지 URL 최적화**

```typescript
// utils/imageUtils.ts
export const getOptimizedImageUrl = (url: string) => {
	if (!url) return '/default-profile.png';
	// 이미지 크기를 96x96으로 제한
	return `${url}=s96-c`;
};
```

3. **FriendListPage.tsx 수정**

```typescript
import { getOptimizedImageUrl } from '@/utils/imageUtils';

export const FriendsListPage = () => {
  // ... 기존 코드 ...

  return (
    <div className='flex flex-col h-full max-w-md mx-auto bg-white'>
      {/* ... 기존 코드 ... */}
      {!keyword ? (
        <div>
          {friends?.map((friend) => (
            <UserRowItem
              key={friend.id}
              userName={friend.nickname}
              userAvatar={getOptimizedImageUrl(friend.profileImage)}
              userStatus={friend.oneLiner}
              actionType='arrow'
              onClick={() => console.log('Navigate to user profile')}
            />
          ))}
        </div>
      ) : (
        // ... 검색 결과 목록 ...
      )}
    </div>
  );
};
```

### 예시

```typescript
// 이미지 최적화 전
https://lh3.googleusercontent.com/a/ACg8ocKA2rKTYFTRCmV6mmsWcupxFlKVWkQm9cOmYu2uodC8Iqr9Lg

// 이미지 최적화 후
https://lh3.googleusercontent.com/a/ACg8ocKA2rKTYFTRCmV6mmsWcupxFlKVWkQm9cOmYu2uodC8Iqr9Lg=s96-c
```

### 결론 및 정리

1. **성능 최적화**

   - `loading="lazy"` 속성으로 이미지 지연 로딩
   - 이미지 크기 제한으로 다운로드 용량 감소
   - 브라우저 캐시 활용으로 반복 요청 방지

2. **에러 처리 강화**

   - 이미지 로드 실패 시 기본 이미지 표시
   - `crossOrigin` 및 `referrerPolicy` 설정으로 보안 강화
   - 이미지 로딩 상태 관리 개선

3. **사용자 경험 개선**
   - 이미지 로딩 속도 향상
   - 429 에러 발생 감소
   - 안정적인 이미지 표시

이러한 변경으로 Google 프로필 이미지 로딩 관련 문제가 해결되어, 더 나은 사용자경
험을 제공할 수 있게 되었습니다.

## [트러블슈팅] FriendRequestPage 레이아웃 문제 트러블슈팅(2025/05/08-안주민)

### 문제상황

- FriendRequestPage가 웹 레이아웃에서 컨텐츠가 보이지 않는 문제 발생
- 모바일 레이아웃에서는 정상 작동하나 웹 레이아웃에서만 문제 발생
- 헤더와 컨텐츠가 겹치는 현상 발생

### 원인 분석

1. 레이아웃 구조의 차이

   - WebLayout: header가 `absolute` 포지션 사용
   - MobileLayout: header가 `fixed` 포지션 사용
   - MobileLayout은 `mt-16`으로 헤더 높이만큼 마진을 주고 있었으나, WebLayout은
     이 마진이 없었음

2. 컴포넌트 구조의 문제
   - FriendRequestListPage에서 불필요한 div 래퍼로 인한 스타일 중첩
   - FriendRequestPage에서 직접 레이아웃 관련 스타일을 처리하려 시도

### 해결방법

1. FriendRequestListPage 수정

   - 불필요한 div 래퍼 제거
   - 컴포넌트 구조 단순화

2. FriendRequestPage 수정

   - 레이아웃 관련 스타일 제거
   - 컨텐츠에만 집중하도록 수정

3. WebLayout 수정
   - main 태그에 `mt-16` 추가하여 헤더 높이만큼 마진 부여
   - MobileLayout과 동일한 방식으로 컨텐츠 영역 조정

### 예시

```tsx
// WebLayout.tsx 수정 전
<main className='flex-1 h-full flex flex-col overflow-y-auto'>

// WebLayout.tsx 수정 후
<main className='flex-1 h-full flex flex-col overflow-y-auto mt-16'>
```

### 결론 및 정리

1. 레이아웃 관련 스타일은 레이아웃 컴포넌트에서 일관되게 처리해야 함
2. 웹/모바일 레이아웃 간의 차이점을 명확히 이해하고 일관된 스타일 적용 필요
3. 불필요한 컴포넌트 래핑은 스타일 중첩 문제를 일으킬 수 있으므로 주의 필요
4. 레이아웃과 컨텐츠의 책임을 명확히 분리하여 관리하는 것이 중요
