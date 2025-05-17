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

## [html2canvas(썸네일 캡처) 동작 원리 및 Portal 적용 이슈]

- 웹에서 특정 DOM(코디 캔버스 등)을 이미지(썸네일)로 캡처할 때 html2canvas 등 라
  이브러리를 사용

### 1. 동작 목적/배경

- 사용자가 만든 코디 결과물을 서버에 이미지(썸네일)로 저장/업로드하기 위함
- html2canvas는 실제 DOM을 캔버스로 그려 base64/png 등 이미지로 변환해줌

### 2. 동작 구조/원리

- html2canvas는 지정한 DOM 요소의 **실제 렌더링 결과(브라우저에 보이는 모습)**를
  캡처
- 내부적으로 DOM의 스타일, 위치, 크기, 배경, 이미지 등 모든 렌더링 결과를 canvas
  에 복제
- 복제된 canvas를 base64/png 등으로 변환하여 반환
- **중요:** 캡처 시점에 해당 `DOM이 실제로 화면에 렌더`되어 있어야 하며,
  `부모의 CSS(overflow, flex, visibility, display 등) 영향도 그대로 반영`됨

### 3. 세부 동작 과정

1. 캡처 대상 DOM(예: CodiCanvas)이 렌더됨
2. html2canvas가 해당 DOM의 스타일/레이아웃/이미지 등 렌더링 결과를 분석
3. `부모/조상 요소의 CSS(flex, overflow, visibility, display 등)까지 모두 반영하여 canvas에 그림`
4. 완성된 canvas를 base64/png 등 이미지로 변환
5. 서버 업로드 등 후처리 진행

### 4. 고려사항/특이사항

- **부모의 CSS 영향:**
  - 캡처 대상이 flex/overflow 구조의 부모 아래에 있으면,
    `부모의 크기/스크롤/숨김 등 영향으로 실제 캡처 결과가 달라짐`
  - 예: 부모가 overflow: auto, height: 0, display: none, visibility: hidden 등일
    때 캡처 실패/크기 오류 발생
- **렌더링 타이밍:**
  - 캡처 시점에 DOM이 완전히 렌더되어 있어야 하며, requestAnimationFrame 등으로
    렌더 완료 후 캡처 필요
- **Portal 적용 효과:**
  - 캡처용 DOM을 React Portal로 document.body에 직접 렌더하면, 부모의 모든 CSS
    영향에서 벗어나 항상 원하는 크기/위치로 캡처 가능
  - 실제 사용자에게는 보이지 않게(투명, pointerEvents: none) 렌더하여 UX에 영향
    없음

### 5. 결론/의견

- html2canvas 등 캡처 라이브러리는 **실제 브라우저에 렌더된 결과**를 그대로 이미
  지로 변환하므로, `부모의 CSS 구조/상태에 매우 민감함`
- 캡처 신뢰성을 높이려면, 캡처용 DOM을 `Portal로 body에 직접 렌더하는 것`이 가장
  안전함
- 렌더링 타이밍, 부모 CSS 영향, 캡처 대상의 visibility 등도 반드시 고려해야 함

### 6. 예시 코드 및 추가 사례

#### (1) 기본 사용 예시

```js
import html2canvas from 'html2canvas';

const element = document.getElementById('capture-target');
html2canvas(element).then((canvas) => {
	const imgData = canvas.toDataURL('image/png');
	// imgData를 서버 업로드 등 활용
});
```

#### (2) Portal 적용 전/후 비교 예시

// Portal 적용 전 (문제 발생 가능)

```jsx
<div className="w-full h-screen flex flex-col bg-white">
  <div className="flex-1 flex flex-col overflow-auto">
    <div className="bg-gray-50">
      <CodiCanvas id="capture-target" ... />
    </div>
  </div>
</div>
// html2canvas(document.getElementById('capture-target'))
// → 부모의 flex/overflow/visibility 등 영향으로 캡처 실패/크기 오류 가능
```

// Portal 적용 후 (문제 해결)

```jsx
{createPortal(
  <div style={{position: 'fixed', top: 0, left: 0, width: 400, height: 440, opacity: 0, pointerEvents: 'none'}}>
    <CodiCanvas id="capture-target" ... />
  </div>,
  document.body
)}
// html2canvas(document.getElementById('capture-target'))
// → 항상 원하는 크기/위치로 캡처 100% 보장
```

#### (3) 캡처 실패/이상 사례

- 부모가 `display: none` 또는 `visibility: hidden`이면 캡처 대상이 렌더되지 않아
  캡처 결과가 빈 이미지가 됨
- 부모가 `overflow: auto`이고 스크롤이 발생하면, 보이지 않는 영역은 캡처되지 않
  음
- 부모가 `height: 0`이면 자식도 크기가 0이 되어 캡처 결과가 없음
- 렌더링이 끝나기 전에 캡처하면, 이미지가 비어 있거나 일부만 캡처됨

#### (4) 렌더링 타이밍 보장 예시

```js
// requestAnimationFrame을 여러 번 중첩하여 렌더링 완료 후 캡처
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    html2canvas(document.getElementById('capture-target')).then(...);
  });
});
```

### 7. 더 깊은 원리 설명

- html2canvas는 실제 브라우저의 렌더 트리(Render Tree)를 분석하여, CSSOM(스타일
  ), 레이아웃, 이미지, 폰트, 배경 등 `모든 시각적 요소를 canvas에 복제`
- 이 과정에서 부모/조상 요소의 모든 CSS 속성(overflow, position, z-index,
  opacity, transform 등)이 그대로 반영됨
- Portal을 사용하면, 캡처 대상 DOM이 body 바로 아래에 위치하므로, 조상 요소의 영
  향(특히 flex, overflow, visibility, display 등)에서 완전히 자유로워짐
- 실제로 html2canvas는 `"보이는 그대로"를 캡처`하므로, 캡처 대상이 화면에 보이지
  않거나(visibility: hidden, display: none, opacity: 0 등) `크기가 0`이면, 결과
  도비어 있게 됨
- 따라서, `캡처 신뢰성을 위해서는 Portal + 렌더링 타이밍 보장`
  (requestAnimationFrame 등) + 캡처 대상의 visibility/크기 체크가 필수
