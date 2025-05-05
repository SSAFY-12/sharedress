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
