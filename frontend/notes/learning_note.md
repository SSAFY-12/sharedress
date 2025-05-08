[양식]

1. 개요
2. 기본 사용법
3. 동작방식
4. 일반적인 사용 사례
5. 장점
6. 주의 사항
7. 실제 사용 예시
8. 결론

---

# React Query의 enabled 옵션 사용 가이드 (2025/05/05-안주민)

## 개요

- React Query의 `enabled` 옵션은 쿼리의 실행 여부를 제어하는 강력한 기능
- 이 옵션을 사용하면 `useEffect` 없이도 조건부 쿼리 실행이 가능

## 기본 사용법

```typescript
const useSearchFriend = (nickname: string) => {
	return useQuery<SearchFriendResponse>({
		queryKey: ['searchFriend', nickname],
		queryFn: () => socialApi.searchFriend(nickname),
		enabled: !!nickname, // nickname이 있을 때만 쿼리 실행
	});
};
```

## enabled 옵션의 동작 방식

1. `enabled: true`일 때:

   - 쿼리가 자동으로 실행됨
   - queryKey가 변경될 때마다 쿼리가 재실행됨

2. `enabled: false`일 때:
   - 쿼리가 실행되지 않음
   - 수동으로 `refetch()`를 호출하지 않는 한 쿼리가 실행되지 않음

## 일반적인 사용 사례

### 1. 조건부 쿼리 실행

```typescript
// 빈 문자열이 아닐 때만 쿼리 실행
enabled: !!searchValue;

// 특정 조건이 만족될 때만 쿼리 실행
enabled: isAuthenticated && !!userId;

// 여러 조건을 조합
enabled: isReady && !!searchValue && !isLoading;
```

### 2. useEffect 대체

```typescript
// 이전: useEffect 사용
useEffect(() => {
	if (searchValue) {
		// 검색 실행
	}
}, [searchValue]);

// 이후: enabled 옵션 사용
const { data } = useQuery({
	queryKey: ['search', searchValue],
	queryFn: () => searchApi(searchValue),
	enabled: !!searchValue,
});
```

## 장점

1. 코드 간소화: `useEffect` 사용 없이 조건부 쿼리 실행 가능
2. 자동 재실행: queryKey 변경 시 자동으로 쿼리 재실행
3. 조건부 실행: 특정 조건이 만족될 때만 쿼리 실행
4. 캐시 관리: React Query의 캐시 시스템과 통합

## 주의사항

1. `enabled: false`일 때는 쿼리가 실행되지 않으므로, 필요한 경우 `refetch()`를수
   동으로 호출해야 함
2. `enabled` 옵션은 쿼리의 실행 여부만 제어하며, 쿼리의 결과나 에러 상태는 그대
   로 유지됨
3. `enabled`가 `false`에서 `true`로 변경될 때만 쿼리가 실행됨

## 실제 사용 예시

```typescript
// FriendSearchResultPage.tsx
const [resultValue, setResultValue] = useState('');

// resultValue가 변경될 때마다 자동으로 쿼리가 실행됨
// resultValue가 빈 문자열이면 쿼리가 실행되지 않음
const { data: searchAllFriend } = useSearchFriend(resultValue);

const handleSearch = (e: React.KeyboardEvent) => {
	if (e.key === 'Enter') {
		setResultValue(searchValue); // 이렇게 하면 자동으로 쿼리가 실행됨
	}
};
```

## 결론

React Query의 `enabled` 옵션을 사용하면 `useEffect` 없이도 조건부 쿼리 실행이 가
능하며, 코드를 더 간결하고 관리하기 쉽게 만들 수 있습니다. 특히 검색 기능과 같은
조건부 데이터 페칭에 매우 유용합니다.

---

## 1. 개요

**useInfiniteQuery**는 React Query에서 제공하는 훅으로,  
"무한 스크롤(Infinite Scroll)" 또는 "더보기" 기능을 쉽게 구현할 수 있도록 도와줍
니다.  
일반적인 `useQuery`는 한 번에 한 페이지만 데이터를 가져오지만,  
`useInfiniteQuery`는 여러 페이지의 데이터를 순차적으로 불러와서 리스트에 계속 추
가할 수 있습니다.

---

## 2. 기본 사용법

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchUsers = async ({ pageParam = 0 }) => {
	const res = await fetch(`/api/users?page=${pageParam}&size=10`);
	return res.json();
};

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
	useInfiniteQuery(['users'], fetchUsers, {
		getNextPageParam: (lastPage, allPages) => {
			// 다음 페이지가 있으면 pageParam 반환, 없으면 undefined
			return lastPage.hasNextPage ? allPages.length : undefined;
		},
	});
```

---

## 3. 동작방식

- **pageParam**: 현재 페이지 번호(혹은 오프셋)를 내부적으로 관리합니다.
- **getNextPageParam**: 마지막으로 받아온 데이터(`lastPage`)를 참고해, 다음 페이
  지를 불러올 때 사용할 pageParam을 반환합니다.
- **fetchNextPage**: 다음 페이지 데이터를 불러오는 함수입니다.
- **hasNextPage**: 다음 페이지가 있는지 여부를 나타냅니다.
- **isFetchingNextPage**: 다음 페이지를 불러오는 중인지 여부를 나타냅니다.
- 받아온 데이터는 `data.pages` 배열에 각 페이지별로 쌓입니다.

---

## 4. 일반적인 사용 사례

- 인스타그램, 페이스북 피드처럼 스크롤을 내릴 때마다 새로운 데이터를 불러와야 할
  때
- "더보기" 버튼으로 데이터를 추가로 불러올 때
- 페이지네이션 기반 API를 사용할 때
- 상품 목록, 댓글, 게시글 등 대량의 리스트를 점진적으로 불러와야 할 때

---

## 5. 장점

- 페이지 번호/오프셋 관리, 데이터 합치기, 마지막 페이지 체크 등 번거로운 작업을
  자동으로 처리해줍니다.
- 서버에서 데이터를 점진적으로 받아와, 초기 로딩 속도를 빠르게 할 수 있습니다.
- React Query의 캐싱, 상태관리, 에러 핸들링 등과 자연스럽게 통합됩니다.

---

## 6. 주의 사항

- **getNextPageParam**에서 반드시 다음 페이지가 있는지 없는지 정확히 판단해야 합
  니다.  
  (API에서 `hasNextPage`나 `nextPage` 정보를 내려주는 것이 좋음)
- 데이터 합칠 때는 `data.pages.flatMap(page => page.items)`처럼 각 페이지의 데이
  터를 합쳐야 합니다.
- 스크롤 이벤트 감지는 Intersection Observer API를 활용하는 것이 일반적입니다.
- 너무 많은 데이터를 한 번에 불러오지 않도록 주의해야 합니다.

---

## 7. 실제 사용 예시

```tsx
import { useRef, useEffect } from 'react';

const bottomRef = useRef(null);

useEffect(() => {
	if (!hasNextPage || isFetchingNextPage) return;
	const observer = new IntersectionObserver((entries) => {
		if (entries[0].isIntersecting) {
			fetchNextPage();
		}
	});
	if (bottomRef.current) observer.observe(bottomRef.current);
	return () => observer.disconnect();
}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

const users = data?.pages.flatMap((page) => page.users) ?? [];

return (
	<div>
		{users.map((user) => (
			<div key={user.id}>{user.name}</div>
		))}
		<div ref={bottomRef} />
		{isFetchingNextPage && <div>로딩중...</div>}
	</div>
);
```

---

## 8. 결론

**useInfiniteQuery**는 무한 스크롤, 더보기 등 점진적 데이터 로딩이 필요한 UI에
서  
복잡한 페이지네이션 로직을 간단하게 구현할 수 있게 해주는 React Query의 강력한도
구입니다.  
적절히 활용하면 사용자 경험을 크게 향상시킬 수 있습니다!

---

# React Query의 mutate와 mutateAsync 사용 가이드 (2025/05/06-안주민)

## 1. 개요

React Query의 `useMutation` 훅은 데이터를 수정하는 작업을 처리할 때 사용되며,
`mutate`와 `mutateAsync` 두 가지 메서드를 제공한다. 각각의 메서드는 서로 다른 사
용 사례에 적합하며, 상황에 맞는 올바른 선택이 중요하다.

## 2. 기본 사용법

```typescript
// mutate 사용
const mutation = useMutation({
	mutationFn: (data) => api.post(data),
	onSuccess: () => console.log('성공'),
	onError: (error) => console.error('에러:', error),
});
mutation.mutate(data);

// mutateAsync 사용
const mutation = useMutation({
	mutationFn: (data) => api.post(data),
});
try {
	await mutation.mutateAsync(data);
	console.log('성공');
} catch (error) {
	console.error('에러:', error);
}
```

## 3. 동작방식

### mutate

- Promise를 반환하지 않음
- 비동기 작업 완료를 기다리지 않고 즉시 다음 코드 실행
- 성공/실패는 `onSuccess`, `onError` 콜백으로 처리
- `UI 이벤트 핸들러`에 최적화

### mutateAsync

- Promise를 반환
- `await`를 사용하여 `비동기 작업 완료 대기 가능`
- try/catch로 직접 에러 처리 가능
- Promise 체인 구성 가능

## 4. 일반적인 사용 사례

### mutate 사용이 적합한 경우

- `단순한 UI 이벤트 핸들러`
- 성공/실패 처리가 콜백으로 충분한 경우
- 비동기 작업의 완료를 기다릴 필요가 없는 경우
- `즉각적인 UI 피드백`이 필요한 경우

### mutateAsync 사용이 적합한 경우

- 다른 비동기 작업과 연계해서 사용해야 할 때
- Promise 체인이 필요한 경우
- try/catch로 직접 에러 처리가 필요한 경우
- `비동기 작업의 완료를 기다려야 하는 경우`

## 5. 장점

### mutate의 장점

- UI 응답성이 뛰어남
- 코드가 단순하고 직관적
- 콜백 기반의 명확한 성공/실패 처리

### mutateAsync의 장점

- Promise 기반의 유연한 에러 처리
- 다른 비동기 작업과의 쉬운 통합
- 비동기 작업의 완료를 명확하게 제어 가능

## 6. 주의 사항

- `mutate` 사용 시 비동기 작업 완료를 기다리지 않으므로, 작업 완료 후 필요한 처
  리는 반드시 `onSuccess` 콜백에서 수행
- `mutateAsync` 사용 시 Promise 체인이 복잡해질 수 있으므로, 필요한 경우에만 사
  용
- 두 메서드 모두 로딩 상태(`isPending`)와 에러 상태(`error`)를 제공하므로, UI 피
  드백에 활용 가능

## 7. 실제 사용 예시

```typescript
// UI 이벤트에 적합한 mutate 사용
const handleClick = () => {
	mutation.mutate(data);
};

// 복잡한 비동기 로직에 적합한 mutateAsync 사용
const handleComplexOperation = async () => {
	try {
		await mutation.mutateAsync(data);
		await anotherAsyncOperation();
		showSuccessMessage();
	} catch (error) {
		handleError(error);
	}
};
```

## 8. 결론

`mutate`와 `mutateAsync`는 각각의 장단점이 있으며, 사용 사례에 따라 적절한 메서
드를 선택해야 한다. 단순한 UI 이벤트나 즉각적인 피드백이 필요한 경우 `mutate`를,
복잡한 비동기 로직이나 Promise 체인이 필요한 경우 `mutateAsync`를 사용하는 것이
좋다. 두 메서드 모두 React Query의 강력한 기능을 활용할 수 있으며, 상황에 맞는
올바른 선택이 중요하다.
