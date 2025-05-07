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
   			useAuthStore.getState().logout();
   			window.location.href = '/auth';
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
   		useAuthStore.getState().logout();
   		window.location.href = '/auth';
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
