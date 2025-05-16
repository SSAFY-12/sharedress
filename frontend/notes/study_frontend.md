# [정형화된 기록 양식 예시]

## [기능/이슈명]

- (간단한 기능/이슈 요약)

### 1. 동작 목적/배경

- (왜 이 기능/이슈가 필요한지)

### 2. 동작 구조/원리

- (핵심 동작 구조, 상태, 흐름 등)

### 3. 세부 동작 과정

1. (step1)
2. (step2) ...

### 4. 고려사항/특이사항

- (예외, UX, 기술적 한계 등)

### 5. 결론/의견

- (최종 결론, 남길 의견 등)

---

# FCM(푸시 알림) 설정 및 동작 원리 정리

## 1. 전체 동작 구조

- **FCM 권한 및 토큰 처리**

  - 사용자가 앱에 진입하거나 로그인/새로고침 시 FCM 권한을 확인
  - 권한이 없으면 요청, 허용 시 FCM 토큰 발급 및 서버 저장
  - 권한 거부 시 안내만 띄움
  - 권한 허용 시에만 FCM 토큰을 서버에 저장

- **API 에러 처리**

  - API 에러 발생 시 FCM(브라우저 알림)으로 에러 메시지 전송

- **FCM 토큰 저장**
  - FCM 토큰을 서버에 저장하는 별도 API 활용

## 2. 문제점 및 개선 필요성

- 사용자가 FCM 권한을 허용하지 않았는데도 알림이 동작하거나, 알림 설정이 제대로
  제어되지 않는 문제 발생 가능
- 사용자가 명확하게 "알림을 켜겠다"고 선택한 경우에만 FCM 토큰을 발급/저장해야함

## 3. 개선된 동작 방식 및 UX

- **설정 페이지의 알림 스위치(SwitchToggle)**

  - 사용자가 직접 알림을 켜고 끌 수 있도록 함
  - 스위치를 ON하면 FCM 권한 요청 및 토큰 저장
  - 한 번 ON하면 OFF로 변경 불가(비활성화)

- **현실적인 웹 FCM 동작**
  - 브라우저에서 알림 권한이 허용되어야만 푸시 알림이 동작
  - 권한이 거부된 경우 JS에서 알림을 켤 수 없음
  - 권한이 허용된 경우에만 토큰을 서버에 등록/삭제하여 알림 수신 제어

## 4. 실제 구현 방법

### (1) 상태 관리

- `notificationsEnabled`: 알림 설정 여부
- `notificationLocked`: 한 번 ON되면 true, 스위치 비활성화

### (2) 스위치 ON 시

- FCM 권한 요청 및 토큰 저장 시도
- 성공 시 `notificationsEnabled`, `notificationLocked` 모두 true
- 실패(권한 거부 등) 시 안내 메시지

### (3) 스위치 OFF 불가

- `notificationLocked`가 true면 스위치 비활성화(disabled)

### (4) UI/UX

- 스위치를 켜면 권한이 없을 경우 권한 요청
- 스위치를 끄는 것은 불가(비활성화)
- 안내 메시지는 모달/알림 등으로 제공

## 5. 동작 과정 예시

1. 사용자가 앱에 진입
2. FCM 토큰이 없고, "다신 안보기"도 체크 안 되어 있으면 안내 모달 표시
3. 사용자가 알림 스위치 ON
   - 브라우저 권한 확인
   - 권한 없음 → 권한 요청 → 허용 시 토큰 저장
   - 권한 거부 → 안내 메시지
   - 권한 허용 → 토큰 저장, 스위치 비활성화
4. 사용자가 "다신 안보기"를 누르면 localStorage에 기록되어 안내 모달이 다시 뜨지
   않음

## 6. 결론 및 이유

- SwitchToggle로 알림을 켜는 것은 서버에 FCM 토큰을 등록하는 것
- 브라우저 권한이 거부된 경우에는 JS에서 알림을 켤 수 없음
- "다신 안보기"는 localStorage에 기록하여 UX 개선

---

## [FCM 알림 설정/토글 UX 개선]

- (설정 페이지에서 알림 스위치로 FCM 알림을 직접 켜고, 한 번 켜면 끌 수 없게 UX
  를 개선)

### 1. 동작 목적/배경

- 사용자가 명확하게 "알림을 켜겠다"고 선택한 경우에만 FCM 토큰을 발급/저장하도록
  하여, 불필요한 알림 권한 요청/저장 방지 및 UX 명확화

### 2. 동작 구조/원리

- 알림 스위치(SwitchToggle)를 처음 ON(활성화)하면 FCM 권한 요청 및 토큰 저장
- 한 번 ON이 되면 OFF(비활성화)로 변경 불가(스위치 비활성화)
- 상태: notificationsEnabled(알림 설정 여부), notificationLocked(한 번 ON되면
  true, 스위치 비활성화)

### 3. 세부 동작 과정

1. 사용자가 설정 페이지 진입
2. 알림 스위치가 OFF 상태
3. 사용자가 스위치 ON → FCM 권한 요청
   - 권한 없음: 권한 요청 → 허용 시 토큰 저장, 거부 시 안내
   - 권한 허용: 토큰 저장, 스위치 비활성화
4. 성공 시 notificationsEnabled, notificationLocked 모두 true
5. 스위치 OFF 불가 (notificationLocked가 true면 비활성화)

### 4. 고려사항/특이사항

- 브라우저에서 알림 권한이 거부된 경우 JS에서 알림을 켤 수 없음
- 안내 메시지는 모달/알림 등으로 제공
- 서버에 FCM 토큰을 등록/삭제하는 방식으로 알림 수신 제어

### 5. 결론/의견

- SwitchToggle로 알림을 켜는 것은 서버에 FCM 토큰을 등록하는 것
- 브라우저 권한이 거부된 경우에는 JS에서 알림을 켤 수 없음
- UX를 명확하게 하여 사용자가 의도적으로 알림을 켜는 경우에만 동작하도록 개선

---

## [PWA와 웹 환경 동기화 문제]

- PWA(모바일 설치 앱)와 웹(브라우저)에서 로그인, 알림, 토큰 등이 따로 놀고 동기
  화가 안 되는 현상

### 1. 동작 목적/배경

- 사용자가 PWA로 설치해서 쓰든, 웹에서 접속하든 **동일한 사용자 경험**(로그인,
  알림, 데이터 등)을 제공하고 싶음
- 로그인 상태, 알림(FCM), 토큰 등이 **환경에 따라 분리**되어 불편함 발생

### 2. 동작 구조/원리

- PWA와 웹은 **같은 서비스워커, 같은 도메인, 같은 저장소**를 사용할 때만 상태가
  동기화됨
- 서비스워커가 다르거나, 도메인이 다르거나, 저장소(로컬스토리지 등)가 분리되면각
  각 따로 동작
- FCM(알림) 토큰, 로그인 토큰 등은 **환경별로 따로 관리**될 수 있음

### 3. 세부 동작 과정

1. 서비스워커 파일이 여러 개이거나, 등록 경로가 다르면 각각 따로 동작
2. PWA와 웹이 서로 다른 도메인/포트/프로토콜에서 실행되면 저장소가 분리됨
3. 토큰을 localStorage에만 저장하면 서비스워커와 동기화가 안 됨
4. FCM 토큰이 환경별로 다르게 관리되어 알림이 한쪽에서만 오거나, 토큰이 갱신될때
   마다 로그인이 풀릴 수 있음

### 4. 고려사항/특이사항

- 서비스워커는 반드시 **하나의 파일**로 통일해서 `/` 경로에 등록해야 함
- PWA 설치 및 웹 접속 모두 **동일한 도메인/프로토콜/포트**에서 이루어져야 함
- 토큰 등 중요한 데이터는 **IndexedDB** 등 공유 가능한 저장소를 쓰거나, 서비스워
  커와 main thread 간에 **postMessage**로 동기화 필요
- FCM 토큰 갱신 시 서버에 항상 최신 토큰을 등록해야 함

### 5. 결론/의견

- **서비스워커 파일 통일, 도메인 일치, 토큰 동기화**가 핵심
- 위 세 가지가 맞지 않으면 PWA와 웹이 완전히 분리되어 동작할 수밖에 없음
- 구조를 점검하고, 필요한 부분은 코드/설정 수정이 필요

---

## [웹/모바일/PWA 환경에서 FCM 토큰(또는 인증 토큰) 완전 동기화를 위한 IndexedDB 활용법]

- 웹, PWA, 서비스워커, 여러 탭 등 모든 환경에서 FCM 토큰을 완전히 동기화하는 구
  조와 실전 적용법

### 1. 동작 목적/배경

- **왜 필요한가?**
  - FCM(푸시 알림) 토큰, 인증 토큰 등은 웹, PWA, 서비스워커, 여러 탭에서 **동일
    하게** 관리되어야 함
  - 기존 localStorage는 서비스워커/여러 탭/PWA 환경에서 완벽하게 동기화되지 않음
  - **IndexedDB**는 모든 환경(메인 스레드, 서비스워커, 여러 탭)에서 접근 가능하
    고, 대용량 데이터도 안전하게 저장할 수 있음
  - 토큰이 분리/불일치/유실되면 알림이 안 오거나, 인증이 풀리는 등 치명적 문제발
    생

### 2. 동작 구조/원리

- **Zustand(혹은 전역 상태) + IndexedDB** 조합으로 토큰을 관리
- 토큰을 저장/갱신할 때마다 IndexedDB에도 저장
- 앱 시작 시 IndexedDB에서 토큰을 읽어와 전역 상태에 반영
- 서비스워커, 여러 탭, PWA 등 모든 환경에서 IndexedDB를 통해 토큰을 공유/동기화

### 3. 세부 동작 과정

1. **앱 시작**
   - IndexedDB에서 토큰을 읽어와 전역 상태(Zustand 등)에 반영
2. **토큰 발급/갱신/로그인**
   - setToken 등으로 전역 상태와 IndexedDB에 모두 저장
3. **로그아웃/토큰 만료**
   - clearToken 등으로 전역 상태와 IndexedDB에서 모두 삭제
4. **서비스워커/여러 탭/PWA**
   - 필요할 때 IndexedDB에서 토큰을 읽어와 활용
5. **(선택) BroadcastChannel 등으로 실시간 동기화도 가능**

### 4. 고려사항/특이사항

- **IndexedDB는 비동기 API**이므로, 항상 await/Promise로 처리해야 함
- 서비스워커에서는 importScripts로 idb 라이브러리 사용
- 앱 시작 시 반드시 IndexedDB에서 토큰을 읽어와 전역 상태에 반영해야 함
- localStorage만 쓸 경우 서비스워커/여러 탭/PWA와 완벽히 동기화되지 않음
- 토큰이 여러 곳에 분산 저장되면 동기화/유실/불일치 문제 발생
- IndexedDB는 브라우저 지원이 매우 넓음(모던 브라우저 대부분 지원)

### 5. 결론/의견

- **IndexedDB를 활용하면 웹, PWA, 서비스워커, 여러 탭에서 토큰을 완벽하게 동기화
  할 수 있다**
- localStorage persist만으로는 한계가 있으니, 반드시 IndexedDB를 병행할 것
- 앱 시작 시 IndexedDB에서 토큰을 읽어와 전역 상태에 반영하는 것이 핵심
- 서비스워커에서도 IndexedDB를 통해 토큰을 안전하게 활용 가능
- 실무에서 토큰, 사용자 설정, 캐시 등 다양한 데이터 동기화에 적극 활용할 것

---

## [실전 적용 예시 및 시행착오/지침서]

### 1. IndexedDB 유틸리티 작성

```typescript
// src/utils/indexedDb.ts
import { openDB } from 'idb';

const DB_NAME = 'my-app-db';
const FCM_STORE = 'fcm-token';

export const saveFcmTokenToDb = async (token: string) => {
	const db = await openDB(DB_NAME, 1, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(FCM_STORE))
				db.createObjectStore(FCM_STORE);
		},
	});
	await db.put(FCM_STORE, token, 'token');
};

export const getFcmTokenFromDb = async () => {
	const db = await openDB(DB_NAME, 1);
	return db.get(FCM_STORE, 'token');
};
```

---

### 2. Zustand Store와 연동

```typescript
// src/store/useFcmStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { saveFcmTokenToDb, getFcmTokenFromDb } from '@/utils/indexedDb';

interface FcmStore {
	token: string | null;
	setToken: (token: string | null) => void;
	clearToken: () => void;
	syncFromIndexedDb: () => Promise<void>;
}

const useFcmStore = create<FcmStore>()(
	persist(
		(set) => ({
			token: null,
			setToken: (token) => {
				set({ token });
				if (token) saveFcmTokenToDb(token);
			},
			clearToken: () => {
				set({ token: null });
				saveFcmTokenToDb('');
			},
			syncFromIndexedDb: async () => {
				const token = await getFcmTokenFromDb();
				set({ token: token || null });
			},
		}),
		{ name: 'fcm-store' },
	),
);

export default useFcmStore;
```

---

### 3. 앱 시작 시 동기화

```typescript
// src/main.tsx
import useFcmStore from './store/useFcmStore';
import { useEffect } from 'react';

useEffect(() => {
	useFcmStore.getState().syncFromIndexedDb();
}, []);
```

---

### 4. 서비스워커에서 토큰 활용

```js
// public/firebase-messaging-sw.js
importScripts('https://cdn.jsdelivr.net/npm/idb@7/build/iife/index-min.js');

const DB_NAME = 'my-app-db';
const FCM_STORE = 'fcm-token';

async function getFcmTokenFromDb() {
	const db = await idb.openDB(DB_NAME, 1);
	return db.get(FCM_STORE, 'token');
}

self.addEventListener('push', async (event) => {
	const token = await getFcmTokenFromDb();
	// token을 활용한 로직...
});
```

---

### 5. 시행착오/주의사항

- **localStorage만 썼을 때:**  
  서비스워커, 여러 탭, PWA에서 토큰이 불일치/유실되는 문제 발생
- **IndexedDB를 안 썼을 때:**  
  푸시 알림이 안 오거나, 인증이 풀리는 등 치명적 버그 발생
- **IndexedDB를 썼더니:**  
  모든 환경에서 토큰이 완벽하게 동기화되고, 알림/인증이 안정적으로 동작

---

### 6. 실무 지침/팁

- **앱 시작 시 반드시 IndexedDB에서 토큰을 읽어와 전역 상태에 반영**
- **토큰 저장/갱신/삭제 시 IndexedDB에도 항상 반영**
- **서비스워커/여러 탭/PWA 등 모든 환경에서 IndexedDB를 통해 토큰을 공유**
- **idb 라이브러리 사용 추천(Promise 기반, 사용법 간단)**
- **토큰 외에도 사용자 설정, 캐시 등 다양한 데이터 동기화에 활용 가능**

---

### 7. 결론

- **IndexedDB를 활용하면 웹, PWA, 서비스워커, 여러 탭에서 토큰을 완벽하게 동기화
  할 수 있다**
- 실무에서 반드시 적용할 것!
- 시행착오를 줄이고, 안정적인 푸시/인증/데이터 동기화 구조를 만들 수 있다

---
