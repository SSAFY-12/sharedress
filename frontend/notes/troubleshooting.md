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
- 이 구조는 “부모+자식이 함께 보여야 할 때” 적합

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
- 원하는 UI가 “/social”과 “/social/search”에서 완전히 분리되어야 한다면, 반드시
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
