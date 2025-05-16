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
   - 인터셉터에서 훅을 사용하려는 접근 방식이 잘못됨

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
- 이러한 구조로 변경함으로써 401 무한루프와 서버 과부하를 막을 수 있다.

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

## [트러블슈팅] 친구 요청 취소 시 UI 즉시 반영 문제 (2025/05/11-안주민)

### 문제상황

- 친구 요청 취소 시 UI가 즉시 반영되지 않는 문제 발생
- 취소 버튼 클릭 후 모달은 닫히지만, 목록에서 해당 요청이 사라지지 않음
- 새로고침해야만 취소된 요청이 목록에서 제거됨

### 원인 분석

1. **캐시 무효화(Invalidation) 문제**

   - `cancelRequest` mutation의 `onSuccess` 콜백에서 `friendRequests` 쿼리키 무
     효화 누락
   - `acceptRequest`와 `rejectRequest`에서는 `friendRequests` 쿼리키를 무효화하
     고 있었으나, `cancelRequest`에서는 누락

2. **비동기 처리 순서 문제**

   - `handleAction` 함수에서 mutation 완료를 기다리지 않고 바로 `onClose()` 호출
   - UI 업데이트 전에 모달이 닫혀서 사용자에게 변경사항이 보이지 않음

   **개선 전 문제점:**

   - API 요청이 완료되기 전에 모달이 닫혀서 사용자에게 피드백이 없음
   - 사용자는 요청이 성공했는지 실패했는지 알 수 없음
   - UI가 업데이트된 후에 모달이 닫히므로 사용자가 변경사항을 확인할 수 있음

### 해결방법

1. **캐시 무효화 추가**

   ```typescript
   const cancelRequest = useMutation({
   	mutationFn: (requestId: number) =>
   		socialApi.cancelFriendRequest(requestId),
   	onSuccess: () => {
   		queryClient.invalidateQueries({ queryKey: ['searchUser'] });
   		queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
   	},
   });
   ```

2. **비동기 처리 개선**

   ```typescript
   const handleAction = async () => {
   	if (!friendRequest) return;

   	try {
   		switch (actionType) {
   			case 'cancel':
   				await cancelRequest(friendRequest.id);
   				break;
   		}
   		onClose();
   	} catch (error) {
   		console.error('Failed to process friend request:', error);
   	}
   };
   ```

### 예시

**문제가 있는 코드**

```typescript
// 캐시 무효화 누락
const cancelRequest = useMutation({
	mutationFn: (requestId: number) => socialApi.cancelFriendRequest(requestId),
	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ['searchUser'] });
	},
});

// 비동기 처리 미흡
const handleAction = () => {
	cancelRequest(friendRequest.id);
	onClose(); // mutation 완료 전에 호출
};
```

**개선된 코드**

```typescript
// 캐시 무효화 추가
const cancelRequest = useMutation({
	mutationFn: (requestId: number) => socialApi.cancelFriendRequest(requestId),
	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ['searchUser'] });
		queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
	},
});

// 비동기 처리 개선
const handleAction = async () => {
	try {
		await cancelRequest(friendRequest.id);
		onClose(); // mutation 완료 후 호출
	} catch (error) {
		console.error('Failed to process friend request:', error);
	}
};
```

### 결론 및 정리

1. **React Query 캐시 관리**

   - mutation 성공 시 관련된 모든 쿼리키를 무효화하여 UI 동기화
   - `friendRequests`와 `searchUser` 쿼리키 모두 무효화 필요

2. **비동기 처리**

   - mutation 완료를 기다린 후 UI 업데이트
   - 에러 처리 추가로 안정성 향상

3. **디버깅 포인트**
   - Network 탭에서 API 호출 확인
   - React Query DevTools로 캐시 상태 모니터링
   - 서버 응답 상태 확인

이러한 변경으로 친구 요청 취소 시 UI가 즉시 반영되어 더 나은 사용자 경험을 제공
할 수 있게 되었습니다.

## [트러블슈팅] FriendRequestActionModal 불필요한 API 호출 문제(2025/05/11)

### 문제상황

FriendRequestActionModal 컴포넌트에서 useRequest 훅이 모달의 열림/닫힘 상태와 관
계없이 항상 API를 호출하는 문제가 발생했습니다. 이는 모달이 닫혀있을 때도 불필요
한 API 호출이 발생한다는 것을 의미합니다.

### 원인 분석

1. **React 컴포넌트의 마운트/언마운트 원리**

   - React에서 컴포넌트가 렌더링될 때마다 해당 컴포넌트의 모든 코드가 실행됨
   - `FriendRequestActionModal`이 부모 컴포넌트에 포함되어 있다면, 부모가 렌더링
     될 때마다 모달 컴포넌트의 코드도 실행됨
   - 이는 모달이 실제로 보이지 않더라도(`isOpen={false}`) 마찬가지

2. **부모-자식 컴포넌트 관계의 문제**

   - 부모 컴포넌트(예: FriendRequestPage)에서 모달 컴포넌트가 항상 마운트되어 있
     음
   - 모달의 `isOpen` prop이 `false`여도 컴포넌트 자체는 존재하고 실행됨
   - 결과적으로 모든 친구 요청에 대한 API 호출이 동시에 발생

3. **useRequest 훅의 동작 방식**

   - 컴포넌트가 렌더링될 때마다 useRequest 훅이 호출됨
   - memberId가 항상 존재하여 API 호출이 발생
   - 모달의 isOpen 상태와 관계없이 API 호출이 이루어짐

4. **실제 사용 예시**
   ```typescript
   // 부모 컴포넌트 (FriendRequestPage)
   const FriendRequestPage = () => {
   	return (
   		<div>
   			{/* 다른 컨텐츠 */}
   			{friendRequests.map((request) => (
   				<FriendRequestActionModal
   					key={request.id}
   					isOpen={false} // 모달이 닫혀있음
   					memberId={request.memberId}
   					// ... 다른 props
   				/>
   			))}
   		</div>
   	);
   };
   ```
   - 이 경우 모든 친구 요청에 대해 모달 컴포넌트가 생성됨
   - 각 모달 컴포넌트는 자신의 memberId로 API 호출을 시도
   - 결과적으로 모든 친구 요청에 대한 API가 동시에 호출됨

### 해결방법

useRequest 훅에 전달되는 memberId를 조건부로 전달하도록 수정:

```typescript
const { friendRequest, acceptRequest, rejectRequest, cancelRequest } =
	useRequest(isOpen ? memberId : undefined);
```

### 예시

#### 수정 전

```typescript
const { friendRequest, acceptRequest, rejectRequest, cancelRequest } =
	useRequest(memberId); // 항상 API 호출 발생
```

#### 수정 후

```typescript
const { friendRequest, acceptRequest, rejectRequest, cancelRequest } =
	useRequest(isOpen ? memberId : undefined); // 모달이 열려있을 때만 API 호출
```

### 결론 및 정리

1. **React 컴포넌트 동작 원리 이해**

   - 컴포넌트가 마운트되면 모든 코드가 실행됨
   - 조건부 렌더링이 필요할 때는 적절한 조건 체크 필요

2. **성능 최적화**

   - 불필요한 API 호출 감소
   - 서버 부하 감소
   - 네트워크 트래픽 감소
   - 사용자 경험 개선

3. **React 훅 사용 시 주의사항**

   - 훅의 호출 시점과 조건을 잘 고려해야 함
   - 불필요한 API 호출을 방지하기 위해 조건부 실행을 적절히 활용
   - 타입 안정성을 위해 undefined를 사용하여 타입 에러 방지

4. **모달 컴포넌트 설계 시 고려사항**
   - 모달의 열림/닫힘 상태에 따라 API 호출을 제어하는 것이 성능상 이점이 있음
   - 불필요한 리소스 사용을 방지하기 위한 조건부 로직 구현 필요

## [트러블슈팅] 비로그인 auth 인증 권한 문제(2025/05/12)

### 1. 문제 상황

- **비로그인(게스트) 유저가 `/link/:code`로 접근**  
  → 공개된 링크를 통해 친구 옷장(`/friend/:id`)을 보려고 했음
- 하지만  
  **"인증이 필요합니다"라는 메시지**가 뜨거나  
  **401 에러(Unauthorized)**가 발생해서  
  비로그인 유저가 정상적으로 접근하지 못하는 문제가 발생

---

### 2. 원인 분석

#### (1) 라우팅 구조의 문제

- 처음에는 `/friend/:id` 라우트가  
  **App 컴포넌트 하위**에 위치해 있었음
- App 컴포넌트에서는  
  **로그인(토큰)이 없으면 useTokenValidation을 통해 인증을 강제**했음
- 그래서  
  **비로그인 유저가 `/friend/:id`로 접근해도  
  App이 감싸고 있어서 무조건 인증을 요구**하게 됨

#### (2) 인증/토큰 처리 방식의 문제

- 인증이 필요한 라우트에서는  
  **accessToken이 없으면 ProtectedRoute에서 `/auth`로 리다이렉트**
- App 컴포넌트에서  
  **isPublicRoute(공개 라우트) 목록에 `/friend/:id`가 빠져 있었음**
- 그래서  
  **비로그인 유저가 `/friend/:id`로 접근해도  
  인증이 필요하다는 메시지가 뜸**

#### (3) API 요청 및 리프레시 처리의 문제

- 게스트(비로그인) 유저가 접근했을 때  
  **accessToken이 없는데도 불구하고,  
  API 클라이언트(client.ts)에서 리프레시 토큰 요청을 시도**
- 리프레시 토큰도 없으니  
  **401 에러가 발생**  
  (이때도 인증이 필요하다는 메시지가 뜰 수 있음)

---

## 3. 해결 방법

### (1) 라우터 구조 개선

- **공개 라우트(비로그인 허용)**는  
  App 컴포넌트 밖에서 바로 렌더링되도록 구조를 변경
- `/friend/:id`를 App 하위가 아니라  
  **최상위 공개 라우트**로 분리

```tsx
export const router = createBrowserRouter([
	{ path: '/auth', element: <AuthPage /> },
	{ path: '/oauth/google/callback', element: <GoogleCallbackHandler /> },
	{ path: '/link/:code', element: <ExternalUserPage /> },
	{ path: '/friend/:id', element: <FriendClosetPage /> }, // <-- App 없이 바로!
	// 인증 필요 라우트
	{
		path: '/',
		element: <App />,
		children: [
			// ...생략
		],
	},
]);
```

### (2) App 컴포넌트의 공개 라우트 조건 강화

- App에서 useTokenValidation을  
  **공개 라우트가 아닐 때만 실행**하도록 조건을 강화

```tsx
const isPublicRoute =
	location.pathname === '/auth' ||
	location.pathname === '/auth/google/callback' ||
	location.pathname === '/oauth/google/callback' ||
	location.pathname.startsWith('/link/') ||
	location.pathname.startsWith('/friend/');

useEffect(() => {
	if (!isPublicRoute) {
		useTokenValidation();
	}
}, [location.pathname]);
```

### (3) 게스트 접근 시 API/리프레시 요청 분기 처리

- **accessToken이 없으면**  
  인증이 필요한 API 요청, 리프레시 요청을  
  **아예 시도하지 않도록 분기 처리**
- 게스트라면 게스트용 데이터만 요청하거나,  
  인증이 필요 없는 API만 호출

---

## 4. 예시

- `/link/:code`로 접근  
  → 공개된 링크라면 `/friend/:id`로 이동  
  → **App이 감싸지 않으므로 인증 강제 X**
- `/friend/:id`에서  
  **accessToken이 없으면 게스트로 동작**  
  (API 요청도 게스트용으로 분기)

---

## 5. 결론 및 정리

- **근본 원인:**

  1. 라우터 구조상 App이 모든 라우트를 감싸고 있어서  
     비로그인 유저도 인증을 강제당함
  2. App 컴포넌트의 공개 라우트 조건이 부족해서  
     비로그인 허용 라우트도 인증을 요구함
  3. 게스트 접근 시에도 인증/리프레시 요청을 시도해서 401 에러가 발생함

- **해결 방법:**

  1. 공개 라우트는 App 밖에서 바로 렌더링
  2. App에서 공개 라우트 조건을 명확히
  3. 게스트 접근 시 인증/리프레시 요청 분기

- **결과:**  
  이제 비로그인 유저도  
  `/link/:code` → `/friend/:id`로  
  **인증 없이 정상적으로 접근**할 수 있게 됨

## [트러블 슈팅] \*\*비로그인(인증 만료) 상태에서 FCM 토큰 저장, refresh 요청 등 불필요한 API 요청(2025/05/13-안주민)

- refresh 토큰이 만료/없을 때도 `/api/auth/refresh`가 반복적으로 호출됨
- FCM 토큰 저장 요청이 인증 없이(401) 두 번씩 발생
- 로그아웃 시 라우팅이 `/login`이 아니라 `/auth`로 가야 함
- 인증 상태 관리가 일관되지 않아, 여러 곳에서 인증 체크가 누락됨

---

### 2. **근본 원인**

- **FCM 토큰 저장 API 호출 전에 로그인(인증) 상태를 체크하지 않음**
- refresh 401(Unauthorized) 발생 시, 즉시 로그아웃 및 라우팅 처리가 미흡
- 로그아웃 시 인증정보 초기화와 라우팅이 일관되지 않음
- 인증 상태 변수(`isLoggedIn`, `isAuthenticated` 등) 사용이 일관되지 않음

---

### 3. **어떻게 바뀌었나? (수정 내역)**

#### 1) **FCM 토큰 저장: 로그인 상태에서만 저장**

- **Before:**  
  FCM 토큰 저장 API가 로그인 여부와 상관없이 호출됨 → 401 에러, 중복 요청
- **After:**  
  `useFcmInitialization.ts`에서 `useAuthStore`의 `isAuthenticated`를 체크,  
  **로그인 상태일 때만** FCM 토큰 저장 API 호출  
  → 불필요한 401 에러, 중복 저장 방지

---

#### 2) **refresh 401 처리: 즉시 로그아웃 및 `/auth`로 이동**

- **Before:**  
  refresh 401 발생 시, clearAuth만 하고 라우팅이 불명확하거나 중복 체크
- **After:**  
  `client.ts` axios 인터셉터에서 refresh 401 발생 시  
  **항상** `clearAuth()` 후 `window.location.href = '/auth'`로 이동  
  → 무한 401 루프, 인증 만료 후 API 요청 방지

---

#### 3) **로그아웃 시 항상 인증정보 초기화 및 `/auth`로 이동**

- **Before:**  
  로그아웃 시 인증정보 초기화와 라우팅이 일관되지 않음
- **After:**  
  `useAuthStore.ts`의 `logout()`에서  
  `clearAuth()` 호출 후 **항상** `/auth`로 이동  
  → 로그아웃 후 인증정보 남거나 잘못된 라우팅 방지

---

#### 4) **코드 내 인증 상태 체크 변수명 통일**

- **Before:**  
  `isLoggedIn`, `isAuthenticated` 등 혼용
- **After:**  
  `isAuthenticated`로 통일  
  → 인증 체크 일관성 확보

---

## 4. **문제의 근본적 해결책**

- **모든 인증 필요한 API 요청 전, 인증 상태(`isAuthenticated`)를 반드시 체크**
- **refresh 401 발생 시 즉시 인증정보 초기화 및 `/auth`로 이동**
- **로그아웃 시 인증정보 초기화 및 `/auth`로 이동**
- **인증 상태 변수명 통일로 코드 일관성 유지**
- **FCM 토큰 저장 등 인증 필요한 로직은 반드시 로그인 상태에서만 실행**

---

## 5. **예시 코드 (핵심 부분)**

### FCM 토큰 저장 (useFcmInitialization.ts)

```ts
const { isAuthenticated } = useAuthStore.getState();
if (isAuthenticated && !isSavingFcmToken) {
	isSavingFcmToken = true;
	try {
		await fcmApi.saveFcmToken(token);
	} catch (error) {
		console.error('FCM 토큰 저장 실패:', error);
	}
	isSavingFcmToken = false;
}
```

#### refresh 401 처리 (client.ts)

```ts
refresh: async () => {
    const response = await client.post(`/api/auth/refresh`);
    return response.data;
},
```

#### 로그아웃 (useAuthStore.ts)

```ts
logout: () => {
  toast.info('로그아웃되었습니다.');
  useAuthStore.getState().clearAuth();
  window.location.href = '/auth';
},
```

---

### 6. **결론 및 정리**

- **문제:**  
  인증 만료/비로그인 상태에서 불필요한 API 요청, 무한 401 루프, 잘못된 라우팅,
  인증 상태 불일치
- **원인:**  
  인증 체크 누락, 401 처리 미흡, 인증 상태 변수 혼용
- **해결:**  
  인증 체크 강화, 401 처리 일원화, 로그아웃/라우팅 일관화, 변수명 통일
- **결과:**  
  인증 만료 시 즉시 `/auth`로 이동,  
  비로그인 상태에서 불필요한 요청 방지,  
  인증 상태 관리 일관성 확보,  
  사용자 경험 및 보안 모두 개선

## [트러블슈팅] Vite PWA에서 registerSW.js가 필요 없는 이유와 injectRegister 옵션의 역할 (2025/05/13-안주민)

### 문제상황

- Vite PWA 플러그인을 사용할 때,  
  `registerSW.js` 파일이 자동으로 생성되고  
  브라우저가 이 파일을 불러오면서  
  **"Cannot use import statement outside a module"** 에러가 발생함.
- 실제로는 서비스워커 등록 코드를 직접 작성해서  
  `registerSW.js`가 필요 없는 상황임에도  
  자동으로 삽입되어 문제가 발생함.

---

### 원인 분석

- Vite PWA 플러그인의 기본 설정(`injectRegister: 'auto'` 또는 `true`)은  
  빌드 시 자동으로 `registerSW.js` 파일을 만들고  
  이를 index.html에 `<script src="/registerSW.js"></script>`로 삽입함.
- 이 파일이 import 문을 포함하거나,  
  브라우저가 모듈로 인식하지 않으면  
  **import 문 에러**가 발생함.
- 하지만, 이미 index.html에서  
  직접 서비스워커 등록 코드를 `<script>`로 작성하고 있다면  
  **registerSW.js는 중복**이 되고, 필요가 없음.

---

### 해결방법

- Vite PWA 플러그인 설정에서  
  `injectRegister: false`로 변경하면  
  registerSW.js 파일이 **생성/삽입되지 않음**.
- 따라서 브라우저가 이 파일을 불러오지 않고,  
  import 문 에러도 발생하지 않음.
- 서비스워커 등록은 index.html의 `<script>`에서 직접 처리하면 됨.

---

### 예시

**vite.config.ts**

```js
VitePWA({
	// ...기존 옵션...
	injectRegister: false, // registerSW.js 자동 생성/삽입 비활성화
});
```

**index.html**

```html
<script>
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', async () => {
			// 직접 서비스워커 등록 코드
			await navigator.serviceWorker.register('/sw.js', { scope: '/' });
			await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
				scope: '/',
			});
		});
	}
</script>
```

→ 별도의 registerSW.js 파일이 필요 없음!

---

### 결론 및 정리

- **registerSW.js는 Vite PWA 플러그인이 자동으로 서비스워커 등록을 위해 생성하는
  파일**이지만,
- 이미 index.html에서 직접 서비스워커 등록 코드를 작성했다면  
  **registerSW.js는 필요 없다**.
- `injectRegister: false`로 설정하면  
  registerSW.js가 생성/삽입되지 않아  
  import 문 에러 등 불필요한 문제가 발생하지 않음.
- \*\*즉, 직접 서비스워커 등록 코드를 작성한 경우에는 registerSW.js를생성하지 않
  도록(injectRegister: false) 설정하는 것이 더 안전하고 명확한 방법입니다.

+index.html에 직접 서비스워커 등록 코드가 있다면, Vite PWA 플러그인이 자동으로생
성하는 registerSW.js 파일은 필요하지 않습니다. 서비스워커 등록의 본질은 브라우저
가 sw.js, firebase-messaging-sw.js 등 서비스워커 파일을 등록하는 것이며, 이 작업
을 직접 자바스크립트 코드로 처리하면 registerSW.js가 없어도 PWA, FCM 등 모든서비
스워커 관련 기능이 정상적으로 동작합니다.

- +오히려 registerSW.js가 남아 있으면 중복 등록, 충돌, import 문 에러 등 불필요
  한 문제가 발생할 수 있으므로, 직접 등록 코드를 작성한 경우에는 registerSW.js를
  생성하지 않도록(injectRegister: false) 설정하는 것이 더 안전하고 명확한 방법입
  니다.
- +즉, index.html에 직접 서비스워커 등록 코드가 있다면 registerSW.js가 없어도 아
  무 문제 없으며, 실제로 없는 것이 더 바람직합니다.

## [트러블슈팅] 토큰 리프레시 및 인증 상태 관리 문제 (2025/05/13-안주민)

### 문제상황

1. **프로필 이미지 주기적 사라짐 현상**

   - 토큰 만료로 인해 프로필 이미지가 주기적으로 사라짐
   - 새로고침 시 로그아웃되는 현상 발생
   - Network 탭에서 refresh 요청이 보이지 않음

2. **토큰 검증 및 갱신 문제**
   - 토큰 검증이 주기적으로 이루어지지 않음
   - 토큰 갱신이 자동으로 이루어지지 않음
   - 불필요한 리프레시 요청 발생 가능성

### 원인 분석

1. **토큰 검증 로직의 문제**

   - `useTokenValidation` 훅의 주기적 검증 로직 미흡
   - 토큰 만료 시간 체크가 불완전
   - 리프레시 토큰 존재 여부 확인 로직 부재

2. **코드 구조의 문제**
   - 토큰 검증과 갱신 로직이 분리되어 있지 않음
   - 중복된 코드 존재
   - 에러 처리가 불완전

### 해결방법

1. **토큰 검증 로직 개선**

   ```typescript
   const validateToken = useCallback(async () => {
   	const hasRefreshToken = document.cookie.includes('refreshToken');
   	const currentToken = useAuthStore.getState().accessToken;

   	// 토큰 검증 로직
   	if (!currentToken) {
   		if (hasRefreshToken) return await handleTokenRefresh();
   		navigate('/auth', { replace: true });
   		return false;
   	}

   	// 만료 시간 체크
   	const expirationTime = getTokenExpiration(currentToken);
   	const timeUntilExpiration = (expirationTime - currentTime) * 1000;

   	if (timeUntilExpiration <= TOKEN_EXPIRATION_BUFFER && hasRefreshToken) {
   		return await handleTokenRefresh();
   	}

   	return true;
   }, [handleTokenRefresh, navigate]);
   ```

2. **주기적 검증 구현**

   - 초기 체크: 3초 후
   - 주기적 체크: 30초마다
   - 토큰 만료 3분 전에 자동 갱신

3. **디버깅 로그 추가**
   ```typescript
   console.log('🔍 토큰 검증 시작:', {
   	토큰존재: !!currentToken,
   	리프레시토큰존재: hasRefreshToken,
   	시간: new Date().toLocaleString('ko-KR'),
   });
   ```

### 예시

리프레시가 요청되는 경우:

1. 토큰이 없고 리프레시 토큰이 있을 때
2. 토큰이 유효하지 않고 리프레시 토큰이 있을 때
3. 토큰이 만료되기 3분 전이고 리프레시 토큰이 있을 때

## 결론 및 정리

1. **개선된 점**

   - 토큰 검증과 갱신 로직 분리
   - 주기적인 토큰 검증 구현
   - 불필요한 리프레시 요청 방지
   - 디버깅을 위한 로그 추가

2. **확인 방법**

   - 브라우저 콘솔에서 로그 모니터링
   - 토큰 만료 시간 확인
   - 리프레시 요청 시점 확인

3. **추가 고려사항**
   - 토큰 만료 시간 버퍼 조정 가능 (현재 3분)
   - 주기적 체크 간격 조정 가능 (현재 30초)
   - 에러 처리 로직 추가 가능

네! 위에 남겨주신 트러블슈팅 노트(2025/05/13-안주민)에 대해 요약 및 정리해드리겠
습니다.

---

## [트러블슈팅] 토큰 리프레시 및 인증 상태 관리 문제 요약(2025/05/13-안주주민)

### 1. 문제상황

- **프로필 이미지가 주기적으로 사라짐**  
  → 토큰 만료로 인해 인증이 풀리면서 발생  
  → 새로고침 시 로그아웃 현상도 동반  
  → 네트워크 탭에서 refresh 요청이 보이지 않음

- **토큰 검증 및 갱신 문제**  
  → 토큰 검증이 주기적으로 이루어지지 않음  
  → 토큰 갱신이 자동으로 이루어지지 않음  
  → 불필요한 리프레시 요청이 발생할 가능성

---

### 2. 원인 분석

- **토큰 검증 로직의 문제**  
  → useTokenValidation 훅의 주기적 검증 로직이 미흡  
  → 토큰 만료 시간 체크가 불완전  
  → 리프레시 토큰 존재 여부 확인 로직이 부재

- **코드 구조의 문제**  
  → 토큰 검증과 갱신 로직이 분리되어 있지 않음  
  → 중복 코드 존재  
  → 에러 처리가 불완전

---

### 3. 해결방법

- **토큰 검증 로직 개선**  
  → accessToken이 없거나 만료 임박(버퍼 이내)이면 handleTokenRefresh()로 갱신 시
  도  
  → navigate로 인증 페이지 이동 처리  
  → 만료 시간 체크 및 버퍼 적용

- **주기적 검증 구현**  
  → 최초 3초 후 1회 체크  
  → 이후 30초마다 주기적으로 체크  
  → 만료 3분 전이면 자동 갱신

- **디버깅 로그 추가**  
  → 토큰 검증 시작, 만료 시간, 남은 시간, 갱신 시도/성공/실패 등 로그로 확인

---

### 4. 예시 (리프레시 요청이 발생하는 경우)

- 토큰이 없고 리프레시 토큰이 있을 때
- 토큰이 유효하지 않고 리프레시 토큰이 있을 때
- 토큰이 만료되기 3분 전이고 리프레시 토큰이 있을 때

---

### 5. 결론 및 정리

- **개선된 점**

  - 토큰 검증과 갱신 로직 분리
  - 주기적인 토큰 검증 구현
  - 불필요한 리프레시 요청 방지
  - 디버깅 로그 추가

- **확인 방법**

  - 브라우저 콘솔에서 로그 모니터링
  - 토큰 만료 시간 및 리프레시 요청 시점 확인

- **추가 고려사항**
  - 토큰 만료 버퍼(3분), 체크 주기(30초) 등 조정 가능
  - 에러 처리 로직 추가 가능

---

### 한 줄 요약

> 토큰 만료와 갱신 로직을 명확히 분리하고, 주기적으로 검증 및 갱신이 이루어지도
> 록 개선하여 인증 상태 문제를 해결했다.

## [트러블슈팅] FCM 토큰 저장/갱신 타이밍 문제 및 개선 (2025/05/13-안주민)

### 문제상황

- FCM(Firebase Cloud Messaging) 토큰이 서버에 저장되는 타이밍이 불명확함
- 로그인, 토큰 리프레시, 앱 최초 진입(새로고침) 등 다양한 상황에서 FCM 토큰이 서
  버에 저장되지 않거나, 누락되는 현상 발생
- 이로 인해 푸시 알림이 정상적으로 동작하지 않거나, 특정 상황에서 알림이 오지 않
  는 문제가 발생

### 원인 분석

- 기존 로직은 앱 최초 진입/새로고침 시에만 FCM 토큰을 서버에 저장
- 로그인 성공, accessToken 리프레시(갱신) 시점에는 FCM 토큰 저장 로직이 없음
- FCM 토큰이 이미 발급되어 있음에도 서버에 저장되지 않는 타이밍이 존재
- 권한 허용 후에는 저장되지만, 이후 인증 상태 변화(로그인/리프레시)에는 반영되지
  않음

### 해결방법

1. **로그인 성공 시 (useAuth.ts)**
   - accessToken 저장 후, FCM 토큰이 있으면 서버에 저장하도록 로직 추가
2. **토큰 갱신 성공 시 (useRefresh.ts)**
   - accessToken 갱신 후, FCM 토큰이 있으면 서버에 저장하도록 로직 추가
3. **앱 최초 진입/새로고침 (useFcmInitialization.ts)**
   - 권한이 이미 허용된 경우, FCM 토큰이 있고 로그인 상태일 때만 서버에 저장하도
     록 명확히 개선

### 예시

```typescript
// useAuth.ts (로그인 성공 시)
setAccessToken(data.content.accessToken);
const fcmToken = useFcmStore.getState().token;
if (fcmToken) {
	await fcmApi.saveFcmToken(fcmToken);
}

// useRefresh.ts (토큰 갱신 성공 시)
setAccessToken(response.content.accessToken);
const fcmToken = useFcmStore.getState().token;
if (fcmToken) {
	await fcmApi.saveFcmToken(fcmToken);
}

// useFcmInitialization.ts (앱 최초 진입/새로고침)
if (permission === 'granted') {
	const token = await requestNotificationPermission();
	if (token) {
		useFcmStore.setState({ token });
		if (isAuthenticated) {
			await fcmApi.saveFcmToken(token);
		}
	}
}
```

### 결론 및 정리

- 이제 로그인, 토큰 리프레시, 앱 최초 진입(새로고침) 등 모든 주요 타이밍에서 FCM
  토큰이 서버에 자동 저장/갱신됨
- 푸시 알림이 누락되는 문제, 인증 상태 변화 시 FCM 토큰 미반영 문제를 해결
- FCM 토큰 저장 타이밍을 명확히 하여, 안정적인 알림 서비스 제공이 가능해짐
- 인증 상태 변화와 FCM 토큰 관리의 연동이 중요함을 확인한 사례

### [트러블슈팅] 웹앱의 모든 Toast 알림을 FCM(브라우저/OS 푸시 알림)으로 전환(2025/05/14-안주민)

---

### 문제상황

- 기존에는 react-toastify의 Toast 알림(화면 우측 상단 팝업)으로 사용자에게 안내
  메시지를 보여줬음.
- 하지만, Toast는 웹앱이 포그라운드(열려있는 상태)일 때만 보이고, 사용자가 탭을
  닫거나 백그라운드에 있으면 알림을 받을 수 없음.

---

### 원인 분석

- Toast는 UI 컴포넌트이기 때문에, 브라우저/OS의 알림 시스템과는 별개로 동작함.
- 중요한 알림(예: 등록 성공, 실패, 복사 완료, 로그아웃 등)을 사용자가 앱을 보고
  있지 않아도 받을 수 있도록 하려면, FCM(푸시 알림)으로 전환이 필요함.

---

### 해결방법

1. **Toast 알림 코드(react-toastify의 toast.XXX) 전체 검색**
2. 각 알림 위치에서 toast 호출을 FCM의 `showNotification`으로 변경
   - `serviceWorker`와 `Notification` API를 활용하여 브라우저/OS 알림을 띄움
3. 기존 ToastContainer 등 Toast 관련 코드 제거(또는 미사용 처리)
4. 알림 메시지, 아이콘 등은 기존 Toast와 동일하게 유지

---

### 예시

#### (1) 기존 코드

```typescript
import { toast } from 'react-toastify';

toast.success('옷을 등록했어요 👚');
toast.error('삭제 실패 😥');
toast.info('내 옷장 주소가 복사됐어요');
toast.info('로그아웃되었습니다.');
```

#### (2) 변경 후 코드

```typescript
if ('serviceWorker' in navigator && 'Notification' in window) {
	const registration = await navigator.serviceWorker.ready;
	await registration.showNotification('알림 제목', {
		body: '알림 내용',
		icon: '/android-chrome-192x192.png',
		badge: '/favicon-32x32.png',
	});
}
```

- 예시: 옷 등록 성공 → `'옷을 등록했어요 👚'`라는 푸시 알림이 브라우저/OS에 뜸

---

### 결론 및 정리

- **이제 모든 안내 메시지는 Toast 대신 FCM 푸시 알림으로 노출됨**
  - 사용자가 웹앱을 보고 있지 않아도(탭이 닫혀있거나 백그라운드여도) 알림을 받을
    수 있음
  - 알림 권한이 필요하므로, 사용자가 권한을 허용해야 정상적으로 동작함
- 적용 파일:
  - `useRegistCloth.ts` (옷 등록/삭제 성공/실패)
  - `ExternalShareModal.tsx` (복사 완료)
  - `useAuthStore.ts` (로그아웃)
  - `useFcmInitialization.ts` (알림 권한 안내 등)
- **중요한 알림을 더 확실하게 사용자에게 전달할 수 있게 됨**

---

# 추가로 궁금한 점이나, 더 보고 싶은 예시가 있으면 언제든 말씀해 주세요!

## [트러블슈팅] Guest Token 인증 처리 문제 해결(2025/05/15-안주민)

### 문제상황

- 비회원(게스트)이 coordinations API에 접근할 때 401 Unauthorized 에러 발생
- guestToken이 쿠키에 존재함에도 불구하고 인증 실패
- 페이지 이동 시 불필요하게 auth 페이지로 리다이렉트되는 문제 발생
- 특히 `/coordinations/friends/1` API 호출 시 401 에러가 발생하는 문제

### 원인 분석

1. **인증 처리 로직의 문제**

   - guestToken이 있음에도 불필요한 인증 체크 수행
   - 401 에러 발생 시 빈 배열을 반환하여 UI 깨짐
   - 리프레시 토큰 시도 조건이 불완전
   - guestToken이 있더라도 accessToken이 없으면 인증 실패로 처리

2. **토큰 검증 로직의 문제**

   - guestToken 존재 여부 확인 로직 부재
   - 불필요한 토큰 갱신 시도
   - guestToken으로도 접근 가능한 API에 대한 예외 처리 부재

3. **API 클라이언트 인터셉터의 문제**
   - 401 에러 발생 시 무조건 리프레시 토큰 시도
   - guestToken이 있는 경우에 대한 예외 처리 부재
   - 원래 요청 재시도 로직 미흡

### 해결방법

#### 1. useTokenValidation.ts 수정

**초기 코드:**

```typescript
const validateToken = useCallback(async () => {
	const hasRefreshToken = document.cookie.includes('refreshToken');
	const hasGuestToken = document.cookie.includes('guestToken');
	const currentToken = useAuthStore.getState().accessToken;

	if (!currentToken) {
		if (hasRefreshToken) {
			return await handleTokenRefresh();
		}
		// guestToken만 있을 때는 그냥 통과
		if (hasGuestToken) {
			console.log('게스트 토큰만 존재, 토큰 검증/갱신 스킵');
			return true;
		}
		navigate('/auth', { replace: true });
		return false;
	}
	return true;
}, [handleTokenRefresh, navigate]);
```

**변경된 코드:**

```typescript
const validateToken = useCallback(async () => {
	const hasRefreshToken = document.cookie.includes('refreshToken');
	const hasGuestToken = document.cookie.includes('guestToken');
	const currentToken = useAuthStore.getState().accessToken;

	console.log('🔍 토큰 검증:', {
		accessToken: !!currentToken,
		refreshToken: hasRefreshToken,
		guestToken: hasGuestToken,
		시간: new Date().toLocaleString('ko-KR'),
	});

	if (!currentToken) {
		if (hasRefreshToken) {
			return await handleTokenRefresh();
		}
		// guestToken만 있을 때는 그냥 통과
		if (hasGuestToken) {
			console.log('게스트 토큰만 존재, 토큰 검증/갱신 스킵');
			return true;
		}
		navigate('/auth', { replace: true });
		return false;
	}
	return true;
}, [handleTokenRefresh, navigate]);
```

**주요 변경점:**

1. guestToken 존재 여부 확인 로직 추가
2. guestToken만 있을 때는 토큰 검증/갱신 스킵
3. 디버깅을 위한 로깅 추가
4. 인증 실패 시 리다이렉트 조건 강화

#### 2. client.ts 수정

**초기 코드:**

```typescript
client.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		const { isGuest } = useAuthStore.getState();

		if (error.response?.status === 401 && !originalRequest._retry) {
			try {
				const response = await authApi.refresh();
				const newToken = response.content.accessToken;
				useAuthStore.getState().setAccessToken(newToken);
				originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
				return axios(originalRequest);
			} catch (refreshError) {
				useAuthStore.getState().logout();
				window.location.href = '/auth';
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	},
);
```

**변경된 코드:**

```typescript
client.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		const { isGuest } = useAuthStore.getState();
		const hasGuestToken = document.cookie.includes('guestToken');

		console.log('🔍 API 응답 에러:', {
			status: error.response?.status,
			url: originalRequest.url,
			guestToken: hasGuestToken,
			시간: new Date().toLocaleString('ko-KR'),
		});

		// guestToken이 있는 경우 401 에러를 무시하고 원래 요청을 재시도
		if (error.response?.status === 401 && hasGuestToken) {
			console.log('게스트 토큰 존재, 원래 요청 재시도');
			return client(originalRequest);
		}

		// 401 에러가 발생했고, 리프레시 토큰 요청이 아닌 경우에만 리프레시 시도
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url?.includes('/auth/refresh') &&
			!isGuest && // 게스트가 아닌 경우에만 리프레시 시도
			!hasGuestToken // guestToken이 없는 경우에만 리프레시 시도
		) {
			try {
				const response = await authApi.refresh();
				const newToken = response.content.accessToken;
				useAuthStore.getState().setAccessToken(newToken);
				originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
				return axios(originalRequest);
			} catch (refreshError) {
				useAuthStore.getState().logout();
				window.location.href = '/auth';
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	},
);
```

**주요 변경점:**

1. guestToken 존재 여부 확인 로직 추가
2. guestToken이 있을 때 401 에러 무시 및 원래 요청 재시도
3. 리프레시 토큰 시도 조건 강화 (guestToken 체크 추가)
4. 디버깅을 위한 로깅 추가

### 변경사항 상세 설명

#### 1. useTokenValidation.ts 변경점

- **추가된 기능**

  - guestToken 존재 여부 확인
  - guestToken만 있을 때 토큰 검증/갱신 스킵
  - 디버깅을 위한 로깅 추가
  - 인증 실패 시 리다이렉트 조건 강화

- **변경 이유**
  - 불필요한 인증 체크 방지
  - guestToken이 있을 때 정상적인 페이지 접근 보장
  - 디버깅 용이성 향상
  - 인증 실패 시 사용자 경험 개선

#### 2. client.ts 변경점

- **추가된 기능**

  - guestToken 존재 시 401 에러 무시
  - 원래 요청 재시도 로직
  - 리프레시 토큰 시도 조건 강화
  - 디버깅을 위한 로깅 추가

- **변경 이유**
  - guestToken으로 정상적인 API 호출 보장
  - 불필요한 auth 페이지 리다이렉트 방지
  - 불필요한 리프레시 토큰 시도 방지
  - 문제 발생 시 디버깅 용이성 향상

### 결론 및 정리

1. **해결된 문제**

   - guestToken으로 coordinations API 접근 가능
   - 불필요한 auth 페이지 리다이렉트 제거
   - 비회원의 코디/옷장 페이지 접근 가능
   - 401 에러 발생 시 적절한 처리

2. **개선된 점**

   - 인증 처리 로직 개선
   - 토큰 검증 로직 강화
   - 에러 처리 방식 개선
   - 디버깅 용이성 향상

3. **추가 확인사항**

   - 서버의 guestToken 인식 여부
   - guestToken의 만료 시간
   - 서버 로그의 guestToken 관련 에러
   - API 응답 상태 코드 확인

4. **테스트 필요 사항**

   - 비회원 시나리오 테스트
   - 페이지 이동 시 guestToken 유지
   - API 호출 정상 동작 확인
   - 에러 발생 시 적절한 처리 확인

5. **주의사항**
   - guestToken이 있는 경우에도 일부 API는 접근 제한 필요
   - guestToken 만료 시 적절한 처리 필요
   - 서버와의 협의를 통한 guestToken 권한 범위 설정 필요
     > > > > > > > 3186cb4fb37114ee3bf8bf037ffc3908c60e4457

#### [트러블 슈팅] 배포 환경에서만 deleteMutation onSuccess가 실행되지 않은 이슈 (김현래/ 2025-05-16)

#### 문제상황

로컬(dev) : 옷 삭제 버튼 → 정상 동작배포(prod) : 첫 클릭 — UI 변동 없음두 번째클
릭 — 403 Forbidden 응답동일한 코드-경로인 등록(register) 은 배포에서도 정상

#### 원인 분석

단계 관찰 해석 ① API 호출 서버는 200 OK → 실제 삭제 완료 요청 자체는 성공 ②
React-Query onSuccess 알림 권한 거부 / 브라우저 미지원 → showNotification()
Promise reject mutation 내부에서 예외 발생 → React-Query가 상태를 "실패"로 뒤집
고 onSuccess(override) 미호출 ③ 컴포넌트 상태 regState (기등록 여부) 가 업데이트
되지 않음 UI는 여전히 "등록됨" 으로 표시 ④ 사용자 재클릭 이미 삭제된 자원에 재요
청 → 403 증상 확인 ※ 등록 로직이 정상인 이유 등록은 addCloset() 로 전역 상태를선
변경한 뒤 알림을 호출함 → 예외가 UI에 영향 X

#### 해결방법

알림 호출을 안전 래퍼로 분리 (safe-notify)

Notification.permission === 'granted' & 지원 여부 선체크

try / catch 로 예외를 삼켜 mutation 상태 보존

상태 변경을 알림 호출 앞으로 이동

알림 대신 Toast 등 클라이언트 전용 피드백으로 교체(선택)

#### 예시 (코드)

// utils/notify.ts export const safeNotify = async ( title: string, options:
NotificationOptions ) => { try { if ( 'serviceWorker' in navigator &&
'Notification' in window && Notification.permission === 'granted' ) { const reg
= await navigator.serviceWorker.ready; await reg.showNotification(title,
options); } } catch (e) { console.warn('notification failed', e); } };

// hooks/useDeleteCloth.ts export const useDeleteCloth = (id?: number) => {
const qc = useQueryClient(); const removeCloset = useClosetStore(s =>
s.removeCloset);

return useMutation({ mutationFn: () => { if (!id) throw new Error('no id');
return LibraryApis.deleteCloth(id); }, retry: false, onSuccess: () => {
removeCloset(id!); // ① 상태 먼저 safeNotify('옷 삭제', { body: '옷을 삭제했어요
🗑️' }); // ② 실패해도 UI 영향 X qc.invalidateQueries({ queryKey: ['closet'] });
}, }); }; 등록 훅도 동일하게 safeNotify 적용.

#### 결론 및 정리

증상 : 배포 환경에서 삭제 버튼이 동작하지 않고 403 재요청이 발생.

근본 원인 : onSuccess 내부의 showNotification() reject → mutation 실패로 전환 →
UI 상태 미반영.

교훈 :

외부 API(알림·클립보드 등)는 항상 권한/지원 여부를 확인하고 try/catch 로 감싸기.

상태 변경 로직을 부수 효과보다 앞에 두기.

React-Query onSuccess 안에서 발생한 모든 예외는 mutation 상태를 실패로 바꾼다는
점을 기억하자.

네! 요청하신 양식에 맞춰서 **서비스워커(PWA/FCM/토큰 동기화) 통합 문제**를 정리
해드리겠습니다.

---

## [트러블슈팅]PWA/FCM/웹 환경에서 서비스워커 및 FCM 토큰 동기화 문제와 통합 해결(2025/05/16-안주민)

### - 문제상황

- 웹과 PWA(모바일 설치 앱)에서 로그인, 알림, 토큰 등이 따로 놀고 동기화가 안 됨
- 서비스워커 파일이 여러 개(`sw.js`, `firebase-messaging-sw.js`,
  `dev-dist/sw.js` 등)
- 알림이 한쪽에서만 오거나, 토큰이 갱신될 때마다 로그인이 풀리는 등 불안정
- dev-dist 등 개발용 임시 파일이 혼란을 가중

---

### - 원인 분석

#### 1. 서비스워커 중복 등록/생성

- 개발용(dev-sw.js), FCM용(firebase-messaging-sw.js), PWA용(sw.js) 등 여러 서비
  스워커가 동시에 등록/생성되고 있었음.
- 브라우저는 "가장 마지막에 등록된 서비스워커"만 활성화하지만, 경로(scope)가 다
  르면 여러 서비스워커가 공존할 수도 있음.
- 각 서비스워커는 서로 다른 캐시, 서로 다른 푸시, 서로 다른 동작을 하게 됨.

#### 2. 중복 서비스워커의 문제점

- **동기화가 안 됨:** 예를 들어, FCM 알림은 `firebase-messaging-sw.js`에서 받고,
  PWA 캐시는 `sw.js`에서 관리하면, 알림/캐시/토큰이 따로 놀게 됨.
- **예상치 못한 버그:** 어떤 환경에서는 알림이 오고, 어떤 환경에서는 안 오고, 어
  떤 환경에서는 캐시가 갱신되고, 어떤 환경에서는 안 됨.
- **토큰/알림/오프라인 기능이 분리되어 사용자 경험이 불안정**
- **dev-dist 등 임시 파일이 실제 서비스와 혼동을 유발**

#### 3. 왜 이렇게 처음에 세팅하게 되었나?

- 개발/운영 환경 분리, FCM과 PWA 기능을 따로 개발하다 보니 각각의 목적에 맞는 서
  비스워커를 따로 만들고 등록
- Vite, Workbox, Firebase 등 각종 툴/플러그인이 자동으로 서비스워커를 생성/등록
  하는 경우가 많음
- 결과적으로 중복 서비스워커가 생기고, 관리가 어려워짐

---

### - 해결방법

1. **서비스워커 파일을 하나로 통합**
   - `public/firebase-messaging-sw.js`에 PWA, FCM, 오프라인 기능 모두 포함
2. **등록 로직도 하나로 통일**
   - `src/utils/serviceWorker.ts`에서 서비스워커 등록 및 FCM 환경변수 전달
   - `main.tsx`에서 한 번만 호출
3. **dev-dist, sw.js 등 불필요한 파일 삭제/무시**
4. **FCM 토큰은 main thread(앱 코드)에서 발급/갱신/서버 저장**
   - 서비스워커는 푸시 수신/표시만 담당
5. **site.webmanifest는 앱 정보만 관리(서비스워커와 직접적 연관 없음)**

---

### - 예시

```typescript
// main.tsx
import { registerServiceWorker } from './utils/serviceWorker';
registerServiceWorker();
```

```typescript
// serviceWorker.ts
export const registerServiceWorker = () => {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('/firebase-messaging-sw.js')
			.then((registration) => {
				registration.active?.postMessage({
					type: 'FCM_CONFIG',
					config: {
						apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
						// ...생략
					},
				});
			});
	}
};
```

```js
// firebase-messaging-sw.js (서비스워커)
importScripts(
	'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
);
importScripts(
	'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js',
);
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'FCM_CONFIG') {
		firebase.initializeApp(event.data.config);
		// ...생략
	}
});
```

---

### - 결론 및 정리

#### 1. 구조적으로 어떻게 바뀌었나?

- **서비스워커 파일:**  
  `public/firebase-messaging-sw.js`  
  → PWA, FCM, 오프라인 기능 모두 통합
- **등록 로직:**  
  `src/utils/serviceWorker.ts`  
  → 환경변수로 FCM 설정 전달
- **앱 진입점:**  
  `src/main.tsx`  
  → `registerServiceWorker()` 호출로 자동 등록
- **dev-dist, sw.js 등:**  
  → 무시/삭제해도 됨 (실제 서비스와 무관)
- **site.webmanifest:**  
  → 앱 이름, 아이콘, 테마 등만 관리(서비스워커와 직접적 연관 없음)

#### 2. 왜 이렇게 바꿔야 하는가?

- **중복 서비스워커는 동기화/버그/관리 문제의 근본 원인**
- **하나의 서비스워커, 하나의 등록 로직**으로 통합해야 웹/PWA/모바일 환경에서 토
  큰, 알림, 오프라인 기능이 모두 동기화됨
- **FCM 토큰은 main thread에서 서버에 저장** (서비스워커는 푸시 수신/표시만 담당
  , 인증/토큰 관리가 더 안전)

#### 3. 실제로 어떻게 동작하는가?

- **웹(PWA 설치 전)과 모바일(PWA 설치 후) 모두 동일한 서비스워커와 등록 로직 사
  용**
- **토큰, 알림, 기타 서비스워커 관련 요소들이 모두 동일하게 동작**
- **동일한 코드, 동일한 타이밍, 동일한 동작** (단, 브라우저 정책 차이만 예외)

#### 4. 앞으로 관리 방법

- **dev-dist 폴더 삭제**
- **public/firebase-messaging-sw.js**만 서비스워커로 사용
- **src/utils/serviceWorker.ts**만 등록로직으로 사용
- **main.tsx**에서 한 번만 호출
- **site.webmanifest**는 앱 정보만 관리

---

### ✅ 요약

- 서비스워커/등록로직/토큰/알림/오프라인 기능 모두 "하나"로 통합
- 중복/충돌/동기화 문제 해결
- 실제로 앱을 실행해 정상 동작만 확인하면 됨
