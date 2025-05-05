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
