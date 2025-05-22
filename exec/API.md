---
title: Sharedress
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# Sharedress

Base URLs:

# Authentication

- HTTP Authentication, scheme: bearer

# 옷

## GET 색상 팔레트 조회

GET /api/clothes/colors

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": [
    {
      "id": 0,
      "name": "string",
      "hexCode": "string"
    }
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[object]|true|none||none|
|»» id|integer|true|none||색상 ID|
|»» name|string|true|none||색상 이름|
|»» hexCode|string|true|none||색상 코드|

## GET 옷 카테고리 조회

GET /api/clothes/categories

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": [
    {
      "id": 0,
      "name": "string"
    }
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[object]|true|none||none|
|»» id|integer|true|none||카테고리 ID|
|»» name|string|true|none||카테고리 명|

## GET 브랜드 검색

GET /api/clothes/brands

고도화
- 영어/한국어 검색 상관없이 해당 브랜드 검색

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|keyword|query|string| no |검색할 브랜드 키워드|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": [
    {
      "id": 0,
      "brandNameKor": "string",
      "brandNameEng": "string"
    }
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[object]|true|none||none|
|»» id|integer|true|none||브랜드 ID|
|»» brandNameKor|string|true|none||브랜드 명 (한글)|
|»» brandNameEng|string|true|none||브랜드 명 (영어)|

## GET 옷 쇼핑몰 조회

GET /api/clothes/shoppingmalls

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "62",
    "message": "Admiratio calamitas itaque minus. Utor aegre cognomen tribuo itaque sequi tabula ager amplexus qui. Vae sit sono tempore illum."
  },
  "content": {
    "id": -24920207,
    "name": "Faye Borer",
    "homepageLink": "https://these-decongestant.name/",
    "purchaseHistoryLink": "https://unaware-perfection.com/"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» id|integer|true|none||쇼핑몰 ID|
|»» name|string|true|none||쇼핑몰 이름|
|»» homepageLink|string|true|none||홈페이지 url|
|»» purchaseHistoryLink|string|true|none||해당 쇼핑몰의 구매내역 url|

## GET 옷 조회 [라이브러리]

GET /api/clothes

5/7
- 카테고리 id 중복 선택 가능 -> 단일 카테고리id로만 필터링

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|keyword|query|string| no |검색할 옷 상품명 키워드 or 브랜드 명|
|categoryId|query|integer| no |카테고리 ID|
|shopId|query|string| no |쇼핑몰 ID(들)|
|cursor|query|integer| no |cursor ID|
|size|query|integer| no |페이지네이션 사이즈(default: 12)|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": [
    {
      "id": 1,
      "name": "string",
      "brandName": "string",
      "image": "string",
      "createdAt": 0,
      "categoryId": 0
    }
  ],
  "pagination": {
    "size": 0,
    "hasNext": true,
    "cursor": 1
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[object]|true|none||none|
|»» id|integer|true|none||ID|
|»» name|string|true|none||name|
|»» brandName|string|true|none||none|
|»» image|string|true|none||none|
|»» createdAt|number|true|none||none|
|»» categoryId|integer|true|none||none|
|» pagination|[Page](#schemapage)|true|none||none|
|»» size|integer|true|none||none|
|»» hasNext|boolean|true|none||none|
|»» cursor|integer|true|none||none|

# 옷 등록

## POST 내 옷 등록 [구매 내역]

POST /api/closet/clothes/purchase-history

> Body Parameters

```json
{
  "shopId": 0,
  "id": "string",
  "password": "string"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» shopId|body|integer| yes |쇼핑몰 id|
|» id|body|string| yes |무신사 아이디|
|» password|body|string| yes |무신사 비밀번호|

> Response Examples

> 202 Response

```json
{
  "status": {
    "code": "55",
    "message": "Dignissimos ara ars. Tutis decipio volva adeo. Absum vespillo cerno attollo aeternus calco consectetur cena caterva arca."
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|202|[Accepted](https://tools.ietf.org/html/rfc7231#section-6.3.3)|202 : 요청이 응답됐는데, 내용이 다 처리된 것은 아닌 상태|Inline|

### Responses Data Schema

HTTP Status Code **202**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» taskId|string|true|none||none|
|»» shopId|integer|true|none||쇼핑몰 ID|

## POST 내 옷 등록 [라이브러리]

POST /api/closet/clothes/library

5/5 변경사항
- api 엔드포인트 변경(로직변경은 X)
/api/clothes/library -> /api/closet/clothes/library

> Body Parameters

```json
{
  "itemId": 0
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» itemId|body|integer| yes |옷 ID|

> Response Examples

> 201 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|integer|true|none||추가된 옷장 옷 ID|

HTTP Status Code **400**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|

## GET 구매내역 옷 등록 완료 여부 조회 [polling용]

GET /api/closet/clothes/purchase-history/task/{taskId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|taskId|path|string| yes |none|
|shopId|query|integer| no |쇼핑몰 ID|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "completed": true
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» completed|boolean|true|none||AI 작업 완료 여부|

## POST 내 옷 등록 [사진 - 업로드]

POST /api/closet/clothes/photos/upload

> Body Parameters

```yaml
photos:
  - file://C:\Users\SSAFY\Pictures\Screenshots\스크린샷 2025-05-16 163150.png
  - file://C:\Users\SSAFY\Pictures\Screenshots\스크린샷 2025-05-16 132452.png

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» photos|body|string(binary)| no |앨범에 있는 사진(들)|

> Response Examples

> 201 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": [
    {
      "id": 0,
      "image": "string"
    }
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[object]|true|none||none|
|»» id|integer|true|none||옷장 옷 ID|
|»» image|string|true|none||S3 업로드 된 url|

## POST 내 옷 등록 [사진 - 추가 정보]

POST /api/closet/clothes/photos/detail

> Body Parameters

```json
[
  {
    "id": 0,
    "name": "string",
    "brandId": 0,
    "categoryId": 0,
    "colorId": 0,
    "isPublic": true
  }
]
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|array[object]| no |none|

> Response Examples

> 202 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "taskId": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|202|[Accepted](https://tools.ietf.org/html/rfc7231#section-6.3.3)|none|Inline|

### Responses Data Schema

HTTP Status Code **202**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» taskId|string|true|none||none|

## GET 사진 업로드 상태 조회 [polling용]

GET /api/closet/clothes/photos/task/{taskId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|taskId|path|string| yes |상태를 확인하고 싶은 task ID|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "completed": true
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» completed|boolean|true|none||ai가 처리를 완료했는지|

## GET 남은 사진 업로드 횟수 조회

GET /api/closet/clothes/photos/remaining-count

> Response Examples

> 200 Response

```json
{
  "remainingCount": 1
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||남은 사진 업로드 횟수(사용자 당 일일 5번 제한)|
|»» remainingCount|integer|true|none||none|

# 옷장

## GET 옷장 조회

GET /api/closet/{memberId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|memberId|path|integer| yes |none|
|categoryId|query|integer| no |none|
|cursor|query|integer| no |none|
|size|query|integer| no |none|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": [
    {
      "id": 1,
      "image": "string",
      "name": "string",
      "brandName": "string",
      "shopName": "string",
      "isPublic": true,
      "createdAt": "string",
      "libraryId": 0
    }
  ],
  "pagination": {
    "size": 0,
    "hasNext": true,
    "cursor": 1
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[object]|true|none||none|
|»» id|integer|true|none||옷장 옷 ID|
|»» image|string|true|none||옷 이미지 url|
|»» name|string|true|none||옷 상품명|
|»» brandName|string|true|none||none|
|»» shopName|string|true|none||구매처|
|»» isPublic|boolean|true|none||none|
|»» createdAt|string|true|none||none|
|»» libraryId|integer|true|none||none|
|» pagination|[Page](#schemapage)|true|none||none|
|»» size|integer|true|none||none|
|»» hasNext|boolean|true|none||none|
|»» cursor|integer|true|none||none|

## GET 옷장 옷 상세 조회

GET /api/closet/clothes/{closetClothesId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|closetClothesId|path|integer| yes |옷장 옷 ID|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "id": 0,
    "image": "string",
    "name": "string",
    "brand": {
      "id": 0,
      "name": "string"
    },
    "shopName": "string",
    "color": {
      "id": 0,
      "name": "string",
      "hexCode": "string"
    },
    "category": {
      "id": 0,
      "name": "string"
    },
    "isPublic": "string",
    "createdAt": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[ClosetClothesDetail](#schemaclosetclothesdetail)|true|none||none|
|»» id|integer|true|none||ID|
|»» image|string|true|none||none|
|»» name|string|true|none||name|
|»» brand|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»» shopName|string|true|none||none|
|»» color|object|true|none||none|
|»»» id|integer|true|none||색상 ID|
|»»» name|string|true|none||색상 이름|
|»»» hexCode|string|true|none||색상 hexcode|
|»» category|object|true|none||none|
|»»» id|integer|true|none||카테고리 ID|
|»»» name|string|true|none||카테고리 이름|
|»» isPublic|string|true|none||none|
|»» createdAt|string|true|none||none|

## PUT 옷장 옷 수정

PUT /api/closet/clothes/{closetClothesId}

> Body Parameters

```json
{
  "name": "string",
  "brandId": 0,
  "categoryId": 0,
  "colorId": 0,
  "isPublic": true
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|closetClothesId|path|integer| yes |옷장 옷 ID|
|body|body|object| no |none|
|» name|body|string¦null| no |name|
|» brandId|body|integer¦null| no |none|
|» categoryId|body|integer¦null| no |none|
|» colorId|body|integer¦null| no |none|
|» isPublic|body|boolean¦null| no |none|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "id": 1,
    "image": "string",
    "name": "string",
    "brandName": "string",
    "shopName": "string",
    "isPublic": true,
    "createdAt": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[ClosetClothes](#schemaclosetclothes)|true|none||none|
|»» id|integer|true|none||옷장 옷 ID|
|»» image|string|true|none||옷 이미지 url|
|»» name|string|true|none||옷 상품명|
|»» brandName|string|true|none||none|
|»» shopName|string|true|none||구매처|
|»» isPublic|boolean|true|none||none|
|»» createdAt|string|true|none||none|

## DELETE 옷장 옷 삭제

DELETE /api/closet/clothes/{closetClothesId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|closetClothesId|path|integer| yes |옷장 옷 ID|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|

## GET 옷장 옷 ID 조회

GET /api/closet/my

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": [
    {
      "id": 0,
      "libraryId": 0
    }
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[object]|true|none||옷장에 있는 옷 ID 리스트|
|»» id|integer|true|none||옷장 옷 ID|
|»» libraryId|integer|true|none||라이브러리 ID|

# 코디

## GET 코디 목록 조회

GET /api/coordinations

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|memberId|query|integer| yes |none|
|scope|query|string| yes |CREATED(직접 만든 것) / RECOMMENDED(추천 받은 것)|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": [
    {
      "id": 0,
      "title": "string",
      "description": "string",
      "isPublic": true,
      "isTemplate": true,
      "thumbnail": "string",
      "createdAt": "string"
    }
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[[Coordination2](#schemacoordination2)]|true|none||none|
|»» id|integer|true|none||코디 ID|
|»» title|string|true|none||코디 제목|
|»» description|string|true|none||코디 설명|
|»» isPublic|boolean|true|none||공개 여부|
|»» isTemplate|boolean|true|none||템플릿 OR 커스텀|
|»» thumbnail|string|true|none||썸네일 이미지 URL|
|»» createdAt|string|true|none||생성일|

## GET 코디 상세 조회

GET /api/coordinations/{coordinationId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|coordinationId|path|integer| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "id": "string",
    "title": "string",
    "description": "string",
    "isPublic": true,
    "isTemplate": true,
    "thumbnail": "string",
    "items": [
      {
        "id": 1,
        "image": "string",
        "position": {
          "x": 0,
          "y": 0,
          "z": 1
        },
        "scale": 0,
        "rotation": 0,
        "category": {
          "id": 0,
          "name": "string"
        }
      }
    ],
    "creator": {
      "id": 1,
      "email": "string",
      "nickname": "string",
      "code": "string",
      "profileImage": "string",
      "oneLiner": "string",
      "isGuest": true
    },
    "owner": {
      "id": 1,
      "email": "string",
      "nickname": "string",
      "code": "string",
      "profileImage": "string",
      "oneLiner": "string",
      "isGuest": true
    },
    "createdAt": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» id|string|true|none||코디 ID|
|»» title|string|true|none||none|
|»» description|string|true|none||none|
|»» isPublic|boolean|true|none||none|
|»» isTemplate|boolean|true|none||none|
|»» thumbnail|string|true|none||썸네일 이미지 URL|
|»» items|[object]|true|none||코디에 사용된 옷들|
|»»» id|integer|true|none||코디 옷 ID|
|»»» image|string|true|none||none|
|»»» position|[Position](#schemaposition)|true|none||none|
|»»»» x|number|true|none||X 좌표 값|
|»»»» y|number|true|none||Y 좌표 값|
|»»»» z|integer|true|none||Z 인덱스 값|
|»»» scale|number|true|none||none|
|»»» rotation|number|true|none||none|
|»»» category|object|true|none||group|
|»»»» id|integer|true|none||none|
|»»»» name|string|true|none||none|
|»» creator|[Member](#schemamember)|true|none||코디 제안자 정보|
|»»» id|integer|true|none||ID|
|»»» email|string|true|none||이메일|
|»»» nickname|string|true|none||닉네임|
|»»» code|string|true|none||닉네임 중복 방지 코드|
|»»» profileImage|string|true|none||프로필 이미지|
|»»» oneLiner|string|true|none||한줄 소개|
|»»» isGuest|boolean|true|none||게스트인지|
|»» owner|[Member](#schemamember)|true|none||코디 제안자 정보|
|»»» id|integer|true|none||ID|
|»»» email|string|true|none||이메일|
|»»» nickname|string|true|none||닉네임|
|»»» code|string|true|none||닉네임 중복 방지 코드|
|»»» profileImage|string|true|none||프로필 이미지|
|»»» oneLiner|string|true|none||한줄 소개|
|»»» isGuest|boolean|true|none||게스트인지|
|»» createdAt|string|true|none||생성일|

## PATCH 코디 공개 여부 수정

PATCH /api/coordinations/{coordinationId}

> Body Parameters

```json
{
  "isPublic": true
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|coordinationId|path|string| yes |none|
|body|body|object| no |none|
|» isPublic|body|boolean| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "id": 0,
    "title": "string",
    "description": "string",
    "isPublic": true,
    "isTemplate": true,
    "thumbnail": "string",
    "createdAt": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[CoordinationShort](#schemacoordinationshort)|true|none||none|
|»» id|integer|true|none||코디 ID|
|»» title|string|true|none||코디 제목|
|»» description|string|true|none||코디 설명|
|»» isPublic|boolean|true|none||공개 여부|
|»» isTemplate|boolean|true|none||템플릿 OR 커스텀|
|»» thumbnail|string|true|none||코디 썸네일|
|»» createdAt|string|true|none||생성일|

## DELETE 코디 삭제

DELETE /api/coordinations/{coordinationId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|coordinationId|path|integer| yes |코디 ID|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|

## POST 내 코디 등록

POST /api/coordinations/my

> Body Parameters

```json
{
  "title": "string",
  "description": "string",
  "isPublic": true,
  "isTemplate": true,
  "items": [
    {
      "id": 0,
      "position": {
        "x": 0,
        "y": 0,
        "z": 1
      },
      "scale": 0,
      "rotation": 0
    }
  ]
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» title|body|string| yes |none|
|» description|body|string| yes |none|
|» isPublic|body|boolean| yes |none|
|» isTemplate|body|boolean| yes |none|
|» items|body|[object]| yes |none|
|»» id|body|integer| yes |옷장 옷 ID|
|»» position|body|[Position](#schemaposition)| yes |none|
|»»» x|body|number| yes |X 좌표 값|
|»»» y|body|number| yes |Y 좌표 값|
|»»» z|body|integer| yes |Z 인덱스 값|
|»» scale|body|number| yes |none|
|»» rotation|body|number| yes |none|

> Response Examples

> 201 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "id": 0,
    "title": "string",
    "description": "string",
    "isPublic": true,
    "isTemplate": true,
    "thumbnail": "string",
    "createdAt": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[CoordinationShort](#schemacoordinationshort)|true|none||none|
|»» id|integer|true|none||코디 ID|
|»» title|string|true|none||코디 제목|
|»» description|string|true|none||코디 설명|
|»» isPublic|boolean|true|none||공개 여부|
|»» isTemplate|boolean|true|none||템플릿 OR 커스텀|
|»» thumbnail|string|true|none||코디 썸네일|
|»» createdAt|string|true|none||생성일|

## POST 친구 코디 등록

POST /api/coordinations/friends/{memberId}

> Body Parameters

```json
{
  "title": "string",
  "description": "string",
  "isTemplate": true,
  "items": [
    {
      "id": 0,
      "position": {
        "x": 0,
        "y": 0,
        "z": 1
      },
      "scale": 0,
      "rotation": 0
    }
  ]
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|memberId|path|integer| yes |none|
|body|body|object| no |none|
|» title|body|string| yes |none|
|» description|body|string| yes |none|
|» isTemplate|body|boolean| yes |none|
|» items|body|[object]| yes |none|
|»» id|body|integer| yes |옷장 옷 ID|
|»» position|body|[Position](#schemaposition)| yes |none|
|»»» x|body|number| yes |X 좌표 값|
|»»» y|body|number| yes |Y 좌표 값|
|»»» z|body|integer| yes |Z 인덱스 값|
|»» scale|body|number| yes |none|
|»» rotation|body|number| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "id": 0,
    "title": "string",
    "description": "string",
    "isPublic": true,
    "isTemplate": true,
    "thumbnail": "string",
    "createdAt": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[CoordinationShort](#schemacoordinationshort)|true|none||none|
|»» id|integer|true|none||코디 ID|
|»» title|string|true|none||코디 제목|
|»» description|string|true|none||코디 설명|
|»» isPublic|boolean|true|none||공개 여부|
|»» isTemplate|boolean|true|none||템플릿 OR 커스텀|
|»» thumbnail|string|true|none||코디 썸네일|
|»» createdAt|string|true|none||생성일|

## GET 친구에게 추천한 코디 목록 조회

GET /api/coordinations/friends/{memberId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|memberId|path|integer| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": [
    {
      "id": 0,
      "title": "string",
      "description": "string",
      "isPublic": true,
      "isTemplate": true,
      "thumbnail": "string",
      "createdAt": "string"
    }
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[[Coordination2](#schemacoordination2)]|true|none||none|
|»» id|integer|true|none||코디 ID|
|»» title|string|true|none||코디 제목|
|»» description|string|true|none||코디 설명|
|»» isPublic|boolean|true|none||공개 여부|
|»» isTemplate|boolean|true|none||템플릿 OR 커스텀|
|»» thumbnail|string|true|none||썸네일 이미지 URL|
|»» createdAt|string|true|none||생성일|

## POST 내 코디로 편입

POST /api/coordinations/{coordinationId}/copy

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|coordinationId|path|integer| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "id": 0,
    "title": "string",
    "description": "string",
    "isPublic": true,
    "isTemplate": true,
    "thumbnail": "string",
    "createdAt": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[CoordinationShort](#schemacoordinationshort)|true|none||none|
|»» id|integer|true|none||코디 ID|
|»» title|string|true|none||코디 제목|
|»» description|string|true|none||코디 설명|
|»» isPublic|boolean|true|none||공개 여부|
|»» isTemplate|boolean|true|none||템플릿 OR 커스텀|
|»» thumbnail|string|true|none||코디 썸네일|
|»» createdAt|string|true|none||생성일|

## POST 코디 요청

POST /api/coordinations/request

> Body Parameters

```json
{
  "receiverId": 0,
  "message": "string"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» receiverId|body|integer| yes |요청할 사용자의 ID|
|» message|body|string| yes |none|

> Response Examples

> 201 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|

## PATCH 코디 썸네일 등록

PATCH /api/coordinations/{coordinationId}/thumbnail

> Body Parameters

```yaml
thumbnail: ""

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|coordinationId|path|integer| yes |none|
|body|body|object| no |none|
|» thumbnail|body|string(binary)| no |none|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "thumbnail": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» thumbnail|string|true|none||이미지 URL|

# 댓글

## GET 코디 댓글 목록 조회

GET /api/coordinations/{coordinationId}/comments

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|coordinationId|path|integer| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": [
    {
      "id": 0,
      "content": "string",
      "depth": 0,
      "parentId": 0,
      "creator": {
        "id": 1,
        "email": "string",
        "nickname": "string",
        "code": "string",
        "profileImage": "string",
        "oneLiner": "string",
        "isGuest": true
      },
      "createdAt": "string"
    }
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[[Comment3](#schemacomment3)]|true|none||none|
|»» id|integer|true|none||댓글 ID|
|»» content|string|true|none||none|
|»» depth|integer|true|none||none|
|»» parentId|integer¦null|false|none||none|
|»» creator|[Member](#schemamember)|true|none||코디 제안자 정보|
|»»» id|integer|true|none||ID|
|»»» email|string|true|none||이메일|
|»»» nickname|string|true|none||닉네임|
|»»» code|string|true|none||닉네임 중복 방지 코드|
|»»» profileImage|string|true|none||프로필 이미지|
|»»» oneLiner|string|true|none||한줄 소개|
|»»» isGuest|boolean|true|none||게스트인지|
|»» createdAt|string|true|none||none|

## POST 코디 댓글 작성

POST /api/coordinations/{coordinationId}/comments

> Body Parameters

```json
{
  "content": "string",
  "parentId": 0
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|coordinationId|path|integer| yes |none|
|body|body|object| no |none|
|» content|body|string| yes |none|
|» parentId|body|integer| no |none|

> Response Examples

> 201 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "id": 0,
    "content": "string",
    "depth": 0,
    "parentId": 0,
    "creator": {
      "id": 1,
      "email": "string",
      "nickname": "string",
      "code": "string",
      "profileImage": "string",
      "oneLiner": "string",
      "isGuest": true
    },
    "createdAt": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» id|integer|true|none||댓글 ID|
|»» content|string|true|none||none|
|»» depth|integer|true|none||none|
|»» parentId|integer¦null|false|none||none|
|»» creator|[Member](#schemamember)|true|none||코디 제안자 정보|
|»»» id|integer|true|none||ID|
|»»» email|string|true|none||이메일|
|»»» nickname|string|true|none||닉네임|
|»»» code|string|true|none||닉네임 중복 방지 코드|
|»»» profileImage|string|true|none||프로필 이미지|
|»»» oneLiner|string|true|none||한줄 소개|
|»»» isGuest|boolean|true|none||게스트인지|
|»» createdAt|string|true|none||none|

## PATCH 코디 댓글 수정

PATCH /api/coordinations/{coordinationId}/comments/{commentId}

> Body Parameters

```json
{
  "content": "string"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|coordinationId|path|integer| yes |none|
|commentId|path|integer| yes |none|
|body|body|object| no |none|
|» content|body|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "id": 0,
  "content": "string",
  "depth": 0,
  "parentId": 0,
  "creator": {
    "id": 1,
    "email": "string",
    "nickname": "string",
    "code": "string",
    "profileImage": "string",
    "oneLiner": "string",
    "isGuest": true
  },
  "createdAt": "string"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|integer|true|none||댓글 ID|
|» content|string|true|none||none|
|» depth|integer|true|none||none|
|» parentId|integer¦null|false|none||none|
|» creator|[Member](#schemamember)|true|none||코디 제안자 정보|
|»» id|integer|true|none||ID|
|»» email|string|true|none||이메일|
|»» nickname|string|true|none||닉네임|
|»» code|string|true|none||닉네임 중복 방지 코드|
|»» profileImage|string|true|none||프로필 이미지|
|»» oneLiner|string|true|none||한줄 소개|
|»» isGuest|boolean|true|none||게스트인지|
|» createdAt|string|true|none||none|

## DELETE 코디 댓글 삭제

DELETE /api/coordinations/{coordinationId}/comments/{commentId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|coordinationId|path|integer| yes |none|
|commentId|path|integer| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|

# 친구

## GET 친구 목록 조회

GET /api/friends

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "items": [
      {
        "id": 1,
        "nickname": "string",
        "code": "string",
        "profileImage": "string",
        "oneLiner": "string",
        "isGuest": true
      }
    ],
    "hasRequest": true
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» items|[[FriendsItem](#schemafriendsitem)]|true|none||none|
|»»» id|integer|true|none||ID|
|»»» nickname|string|true|none||닉네임|
|»»» code|string|true|none||닉네임 중복 방지 코드|
|»»» profileImage|string|true|none||프로필 이미지|
|»»» oneLiner|string|true|none||한줄 소개|
|»»» isGuest|boolean|true|none||게스트인지|
|»» hasRequest|boolean|true|none||친구 요청 여부|

## GET 친구 요청 조회

GET /api/friends/{memberId}/request

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|memberId|path|integer| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "id": 0,
    "message": "string",
    "requester": {
      "id": 0,
      "profileImage": "string",
      "nickname": "string",
      "code": "string"
    }
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[FriendRequestRes](#schemafriendrequestres)|true|none||none|
|»» id|integer|true|none||친구 요청 ID|
|»» message|string|true|none||요청 메시지|
|»» requester|object|true|none||요청한 사람|
|»»» id|integer|true|none||요청한 사람 ID|
|»»» profileImage|string|true|none||요청한 사람 프로필 이미지|
|»»» nickname|string|true|none||요청한 사람 닉네임|
|»»» code|string|true|none||요청한 사람 코드|

## GET 친구 요청 목록 조회

GET /api/friends/request

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": [
    {
      "id": 0,
      "message": "string",
      "requester": {
        "id": 0,
        "profileImage": "string",
        "nickname": "string",
        "code": "string"
      }
    }
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[[FriendRequestRes](#schemafriendrequestres)]|true|none||none|
|»» id|integer|true|none||친구 요청 ID|
|»» message|string|true|none||요청 메시지|
|»» requester|object|true|none||요청한 사람|
|»»» id|integer|true|none||요청한 사람 ID|
|»»» profileImage|string|true|none||요청한 사람 프로필 이미지|
|»»» nickname|string|true|none||요청한 사람 닉네임|
|»»» code|string|true|none||요청한 사람 코드|

## POST 친구 요청

POST /api/friends/request

> Body Parameters

```json
{
  "receiverId": 0,
  "message": "string"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» receiverId|body|integer| yes |친구 요청을 받을 상대방 member id|
|» message|body|string| yes |친구 요청 메시지|

> Response Examples

> 201 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|

## GET 친구 검색

GET /api/friends/search

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|keyword|query|string| no |none|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": [
    {
      "id": 1,
      "nickname": "string",
      "code": "string",
      "profileImage": "string",
      "oneLiner": "string",
      "isGuest": true
    }
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[[FriendsItem](#schemafriendsitem)]|true|none||none|
|»» id|integer|true|none||ID|
|»» nickname|string|true|none||닉네임|
|»» code|string|true|none||닉네임 중복 방지 코드|
|»» profileImage|string|true|none||프로필 이미지|
|»» oneLiner|string|true|none||한줄 소개|
|»» isGuest|boolean|true|none||게스트인지|

## POST 친구 요청 수락

POST /api/friends/request/{requestId}/accept

백에서는 친구 요청 수락 시 친구 관계(Friend) 테이블에 insert

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|requestId|path|integer| yes |친구 요청(FriendRequest) id|

> Response Examples

> 201 Response

```json
{
  "status": {
    "code": "81",
    "message": "Desparatus tredecim adfero tabgo quia defessus copiose conventus vetus. Talus denego tam modi tum. Inventore tunc velut deinde coaegresco."
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|

## POST 친구 요청 거절

POST /api/friends/request/{requestId}/reject

백에서는 친구 요청 거절 시 FriendRequest 테이블에서 해당 요청 삭제

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|requestId|path|integer| yes |친구 요청 id|

> Response Examples

> 201 Response

```json
{
  "status": {
    "code": "80",
    "message": "Cruciamentum vos expedita bos deprimo. Alius desolo officia defendo tandem abbas acervus thalassinus cursus spectaculum. Adeo doloremque certe vigilo tenetur."
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|

## POST 친구 요청 취소

POST /api/friends/request/{requestId}/cancel

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|requestId|path|integer| yes |친구 요청(FriendRequest) id|

> Response Examples

> 201 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|

# 사용자

## GET 사용자 검색

GET /api/members/search

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|keyword|query|string| no |none|
|cursor|query|integer| no |none|
|size|query|integer| no |none|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": [
    {
      "id": 0,
      "profileImage": "string",
      "nickname": "string",
      "code": "string",
      "relationStatus": 0
    }
  ],
  "pagination": {
    "size": 0,
    "hasNext": true,
    "cursor": 1
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[object]|true|none||none|
|»» id|integer|true|none||ID|
|»» profileImage|string|true|none||none|
|»» nickname|string|true|none||none|
|»» code|string|true|none||none|
|»» relationStatus|integer|true|none||0 (친구)<br />1 (친구 요청 보냄)<br />2 (친구 요청 받음)<br />3 (아무 사이 아님)|
|» pagination|[Page](#schemapage)|true|none||none|
|»» size|integer|true|none||none|
|»» hasNext|boolean|true|none||none|
|»» cursor|integer|true|none||none|

## GET 현재 사용자 본인 조회

GET /api/me

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "id": 0,
    "isGuest": true
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» id|integer|true|none||ID|
|»» isGuest|boolean|true|none||게스트 여부|

## GET 내 프로필 조회

GET /api/members/profile/my

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "id": 1,
    "email": "string",
    "nickname": "string",
    "code": "string",
    "profileImage": "string",
    "oneLiner": "string",
    "isPublic": true,
    "notificationStatus": true
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» id|integer|true|none||ID|
|»» email|string|true|none||이메일|
|»» nickname|string|true|none||닉네임|
|»» code|string|true|none||닉네임 중복 방지 코드|
|»» profileImage|string|true|none||프로필 이미지|
|»» oneLiner|string|true|none||한줄 소개|
|»» isPublic|boolean|true|none||계정 공개 여부|
|»» notificationStatus|boolean|true|none||알림 설정|

## GET 특정 사용자 프로필 조회

GET /api/members/{memberId}/profile

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|memberId|path|integer| yes |조회할 사용자 ID|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "id": 1,
    "email": "string",
    "nickname": "string",
    "code": "string",
    "profileImage": "string",
    "oneLiner": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» id|integer|true|none||ID|
|»» email|string|true|none||이메일|
|»» nickname|string|true|none||닉네임|
|»» code|string|true|none||닉네임 중복 방지 코드|
|»» profileImage|string|true|none||프로필 이미지|
|»» oneLiner|string|true|none||한줄 소개|

## PATCH 프로필 (닉네임/상태메시지/공개여부) 정보 변경

PATCH /api/members/profile

> Body Parameters

```json
{
  "nickname": "string",
  "oneLiner": "string",
  "isPublic": true
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» nickname|body|string¦null| no |none|
|» oneLiner|body|string¦null| no |none|
|» isPublic|body|boolean¦null| no |none|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "id": 1,
    "email": "string",
    "nickname": "string",
    "code": "string",
    "profileImage": "string",
    "oneLiner": "string",
    "isPublic": true,
    "notificationStatus": true
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» id|integer|true|none||ID|
|»» email|string|true|none||이메일|
|»» nickname|string|true|none||닉네임|
|»» code|string|true|none||닉네임 중복 방지 코드|
|»» profileImage|string|true|none||프로필 이미지|
|»» oneLiner|string|true|none||한줄 소개|
|»» isPublic|boolean|true|none||계정 공개 여부|
|»» notificationStatus|boolean|true|none||알림 설정|

## PATCH 프로필 사진 변경

PATCH /api/members/profile/image

5/6 변경사항
- api request/response 수정

> Body Parameters

```yaml
profileImage: ""

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» profileImage|body|string(binary)| yes |업로드하려는 프로필 사진 파일 (multipart/form-data)|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "15",
    "message": "Timor virtus sollicito vulariter ea vitiosus officia. Ambitus ustilo vito cernuus deporto venia aveho arbustum curriculum suggero. Aiunt carcer adamo talus crinis."
  },
  "content": {
    "profileImage": "https://loremflickr.com/400/400?lock=6717757834523126"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» profileImage|string|true|none||변경된 profile Image|

## PATCH 푸시알림 수신여부 수정

PATCH /api/members/profile/notification

> Body Parameters

```json
{
  "notificationStatus": true
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» notificationStatus|body|boolean| yes |알림 설정 여부|

> Response Examples

> 200 Response

```json
{
  "code": "90",
  "message": "Veritas deputo tristis. Coaegresco thorax peccatus id volubilis vulgus. Delego vilitas strues voluptatum."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|

## POST 사용자 FCM 토큰 저장

POST /api/members/fcm-token

> Body Parameters

```json
{
  "fcmToken": "string"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» fcmToken|body|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "code": "93",
  "message": "Umerus odit validus abeo verbum auxilium vestrum anser. Adhaero alius nemo. Deduco combibo subvenio."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|

## GET 개인정보 동의 허용 여부 조회

GET /api/members/privacy-agreement

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "privacyAgreement": true
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» privacyAgreement|boolean|true|none||none|

## PATCH 개인정보 동의 허용 여부 수정

PATCH /api/members/privacy-agreement

> Body Parameters

```json
{
  "privacyAgreement": true
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» privacyAgreement|body|boolean| yes |개인정보 동의 허용 여부|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "privacyAgreement": true
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» privacyAgreement|boolean|true|none||none|

# 로그인

## POST 구글 로그인

POST /api/auth/google

> Body Parameters

```json
{
  "accessToken": "string"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» accessToken|body|string| yes |구글에게 받은 accessToken|

> Response Examples

> 201 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "accessToken": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» accessToken|string|true|none||none|

## POST AccessToken 재발급

POST /api/auth/refresh

> Response Examples

> 201 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "accessToken": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» accessToken|string|true|none||none|

## DELETE 로그아웃

DELETE /api/auth/logout

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|

# AI

## POST 구매내역 옷 AI 전처리 완료 수신 API

POST /api/clothes/ai-complete

- AI 서버에서 옷의 전처리를 완료했음을 백엔드에 알리는 알림용 API
- 전처리 완료(imgUrl, color, category 등)는 AI 서버에서 직접 DB에 반영

> Body Parameters

```json
{
  "memberId": 0,
  "taskId": "string",
  "successClothes": [
    0
  ],
  "failClothes": [
    0
  ]
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» memberId|body|integer| yes |none|
|» taskId|body|string| yes |task ID|
|» successClothes|body|[integer]| yes |성공한 clothes id 배열|
|» failClothes|body|[integer]| yes |실패한 clothes id 배열|

> Response Examples

> 200 Response

```json
{
  "code": "85",
  "message": "Clam utrum antea. Delectus cohors vulnero. Versus explicabo civitas."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|string|true|none||none|
|» message|string|true|none||none|

## POST 사진 AI 전처리 완료 수신 API

POST /api/photo/ai-complete

> Body Parameters

```json
{
  "memberId": 0,
  "taskId": "string",
  "successClosetClothes": [
    0
  ],
  "failClosetClothes": [
    0
  ]
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» memberId|body|integer| yes |none|
|» taskId|body|string| yes |none|
|» successClosetClothes|body|[integer]| yes |성공한 옷장 옷 ID(들)|
|» failClosetClothes|body|[integer]| yes |실패한 옷장 옷 ID(들)|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|

# 공개

## GET 공개 링크 발급

GET /api/open-link

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "openLink": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» openLink|string|true|none||none|

## GET 공개 링크 디코딩

GET /api/open-link/{openLink}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|openLink|path|string| yes |해싱된 공개 링크|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "memberId": 0,
    "isPublic": true
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||공개 링크를 발급한 사용자의 ID|
|»» memberId|integer|true|none||none|
|»» isPublic|boolean|true|none||none|

# 알림

## GET 알림 목록 조회

GET /api/notifications

- 알림 최신순 정렬

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": [
    {
      "id": 0,
      "type": "string",
      "title": "string",
      "body": "string",
      "isRead": true,
      "requester": {
        "id": 1,
        "email": "string",
        "nickname": "string",
        "code": "string",
        "profileImage": "string",
        "oneLiner": "string",
        "isGuest": true
      },
      "createdAt": 0
    }
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|object|true|none||none|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|[[Notification](#schemanotification)]|true|none||[id]|
|»» id|integer|true|none||none|
|»» type|string|true|none||FRIEND_REQUEST(1),    // 친구 요청<br />FRIEND_ACCEPT(2),    // 친구 수락COORDINATION_REQUEST(3),    // 코디 요청<br />COORDINATION_RECOMMEND(4) // 코디 추천<br />COORDINATION_COPY(5),    // 코디 복사<br />COMMENT(6);     // 코디 댓글|
|»» title|string|true|none||제목|
|»» body|string|true|none||내용|
|»» isRead|boolean|true|none||읽음 여부|
|»» requester|[MemberInfo](#schemamemberinfo)|true|none||none|
|»»» id|integer|true|none||ID|
|»»» email|string|true|none||이메일|
|»»» nickname|string|true|none||닉네임|
|»»» code|string|true|none||닉네임 중복 방지 코드|
|»»» profileImage|string|true|none||프로필 이미지|
|»»» oneLiner|string|true|none||한줄 소개|
|»»» isGuest|boolean|true|none||게스트인지|
|»» createdAt|number|true|none||none|

## PATCH 알림 읽음 처리

PATCH /api/notifications/{notificationId}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|notificationId|path|integer| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "id": 0,
    "isRead": true,
    "isFirstRead": true
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» id|integer|true|none||알림 id|
|»» isRead|boolean|true|none||알림이 현재 읽음 처리된 상태인지 여부|
|»» isFirstRead|boolean|true|none||처음으로 읽음 처리되었는지 여부(이미 읽은 알림이 아닌지)|

## GET 읽지 않은 알림 여부

GET /api/notifications/unread

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "string",
    "message": "string"
  },
  "content": {
    "hasUnreadNotification": true
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» hasUnreadNotification|boolean|true|none||none|

# URL

## GET S3 url 우회 

GET /api/html2canvas/proxy

테스트 성공하면, accessToken 도 받아야하도록 수정 

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|url|query|string| no |인코딩한 S3 url|

> Response Examples

> 200 Response

```json
{
  "status": {
    "code": "200",
    "message": "OK"
  },
  "content": {
    "base64": "iVBORw0KGgoAAAANSUhEUg...",
    "mimeType": "image/png"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|[Status](#schemastatus)|true|none||status|
|»» code|string|true|none||none|
|»» message|string|true|none||none|
|» content|object|true|none||none|
|»» base64|string|true|none||none|
|»» mimeType|string|true|none||none|

# 관리자

## PATCH 라이브러리 옷 imageUrl 과 옷장 옷 imageUrl을 일괄 동기화

PATCH /api/clothes/image-sync

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Data Schema

<h2 id="tocS_Page">Page</h2>

<a id="schemapage"></a>
<a id="schema_Page"></a>
<a id="tocSpage"></a>
<a id="tocspage"></a>

```json
{
  "size": 0,
  "hasNext": true,
  "cursor": 1
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|size|integer|true|none||none|
|hasNext|boolean|true|none||none|
|cursor|integer|true|none||none|

<h2 id="tocS_Status">Status</h2>

<a id="schemastatus"></a>
<a id="schema_Status"></a>
<a id="tocSstatus"></a>
<a id="tocsstatus"></a>

```json
{
  "code": "string",
  "message": "string"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|code|string|true|none||none|
|message|string|true|none||none|

<h2 id="tocS_ShoppingMall">ShoppingMall</h2>

<a id="schemashoppingmall"></a>
<a id="schema_ShoppingMall"></a>
<a id="tocSshoppingmall"></a>
<a id="tocsshoppingmall"></a>

```json
{
  "name": "string",
  "url": "string",
  "image": "string"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|name|string|true|none||쇼핑몰 이름|
|url|string|true|none||쇼핑몰 홈 url|
|image|string|true|none||쇼핑몰 아이콘|

<h2 id="tocS_Member">Member</h2>

<a id="schemamember"></a>
<a id="schema_Member"></a>
<a id="tocSmember"></a>
<a id="tocsmember"></a>

```json
{
  "id": 1,
  "email": "string",
  "nickname": "string",
  "code": "string",
  "profileImage": "string",
  "oneLiner": "string",
  "isGuest": true
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||ID|
|email|string|true|none||이메일|
|nickname|string|true|none||닉네임|
|code|string|true|none||닉네임 중복 방지 코드|
|profileImage|string|true|none||프로필 이미지|
|oneLiner|string|true|none||한줄 소개|
|isGuest|boolean|true|none||게스트인지|

<h2 id="tocS_Position">Position</h2>

<a id="schemaposition"></a>
<a id="schema_Position"></a>
<a id="tocSposition"></a>
<a id="tocsposition"></a>

```json
{
  "x": 0,
  "y": 0,
  "z": 1
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|x|number|true|none||X 좌표 값|
|y|number|true|none||Y 좌표 값|
|z|integer|true|none||Z 인덱스 값|

<h2 id="tocS_Clothes">Clothes</h2>

<a id="schemaclothes"></a>
<a id="schema_Clothes"></a>
<a id="tocSclothes"></a>
<a id="tocsclothes"></a>

```json
{
  "id": 1,
  "name": "string",
  "brandName": "string",
  "image": "string",
  "createdAt": 0
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||ID|
|name|string|true|none||name|
|brandName|string|true|none||none|
|image|string|true|none||none|
|createdAt|number|true|none||none|

<h2 id="tocS_CoordinationClothes">CoordinationClothes</h2>

<a id="schemacoordinationclothes"></a>
<a id="schema_CoordinationClothes"></a>
<a id="tocScoordinationclothes"></a>
<a id="tocscoordinationclothes"></a>

```json
{
  "id": 1,
  "image": "string",
  "position": {
    "x": 0,
    "y": 0,
    "z": 1
  },
  "scale": 0,
  "rotation": 0
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||코디 옷 ID|
|image|string|true|none||none|
|position|[Position](#schemaposition)|true|none||none|
|scale|number|true|none||none|
|rotation|number|true|none||none|

<h2 id="tocS_Coordination">Coordination</h2>

<a id="schemacoordination"></a>
<a id="schema_Coordination"></a>
<a id="tocScoordination"></a>
<a id="tocscoordination"></a>

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "isPublic": true,
  "isTemplate": true,
  "thumbnail": "string",
  "items": [
    {
      "id": 1,
      "image": "string",
      "position": {
        "x": 0,
        "y": 0,
        "z": 1
      },
      "scale": 0,
      "rotation": 0
    }
  ],
  "creator": {
    "id": 1,
    "email": "string",
    "nickname": "string",
    "code": "string",
    "profileImage": "string",
    "oneLiner": "string",
    "isGuest": true
  },
  "owner": {
    "id": 1,
    "email": "string",
    "nickname": "string",
    "code": "string",
    "profileImage": "string",
    "oneLiner": "string",
    "isGuest": true
  },
  "createdAt": "string"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|string|true|none||코디 ID|
|title|string|true|none||none|
|description|string|true|none||none|
|isPublic|boolean|true|none||none|
|isTemplate|boolean|true|none||none|
|thumbnail|string|true|none||썸네일 이미지 URL|
|items|[[CoordinationClothes](#schemacoordinationclothes)]|true|none||코디에 사용된 옷들|
|creator|[Member](#schemamember)|true|none||코디 제안자 정보|
|owner|[Member](#schemamember)|true|none||코디 제안자 정보|
|createdAt|string|true|none||생성일|

<h2 id="tocS_Comment">Comment</h2>

<a id="schemacomment"></a>
<a id="schema_Comment"></a>
<a id="tocScomment"></a>
<a id="tocscomment"></a>

```json
{
  "id": 0,
  "content": "string",
  "depth": 0,
  "parentId": 0,
  "creator": {
    "id": 1,
    "email": "string",
    "nickname": "string",
    "code": "string",
    "profileImage": "string",
    "oneLiner": "string",
    "isGuest": true
  },
  "createdAt": "string"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||댓글 ID|
|content|string|true|none||none|
|depth|integer|true|none||none|
|parentId|integer¦null|false|none||none|
|creator|[Member](#schemamember)|true|none||코디 제안자 정보|
|createdAt|string|true|none||none|

<h2 id="tocS_FriendRequest">FriendRequest</h2>

<a id="schemafriendrequest"></a>
<a id="schema_FriendRequest"></a>
<a id="tocSfriendrequest"></a>
<a id="tocsfriendrequest"></a>

```json
{
  "id": 1,
  "requesterId": 1,
  "receiverId": 1,
  "message": "string"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||요청 id|
|requesterId|integer|true|none||친구 요청을 보내는 member id|
|receiverId|integer|true|none||친구 요청을 보낼 상대방 member id|
|message|string|true|none||친구 요청 메시지|

<h2 id="tocS_Friend">Friend</h2>

<a id="schemafriend"></a>
<a id="schema_Friend"></a>
<a id="tocSfriend"></a>
<a id="tocsfriend"></a>

```json
{
  "id": 1,
  "member1Id": 1,
  "member2Id": 1,
  "createdAt": 0,
  "deletedAt": 0
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||group|
|member1Id|integer|true|none||친구1 member id|
|member2Id|integer|true|none||친구2 member id|
|createdAt|number|true|none||none|
|deletedAt|number|true|none||none|

<h2 id="tocS_Notification">Notification</h2>

<a id="schemanotification"></a>
<a id="schema_Notification"></a>
<a id="tocSnotification"></a>
<a id="tocsnotification"></a>

```json
{
  "id": 0,
  "type": "string",
  "title": "string",
  "body": "string",
  "isRead": true,
  "requester": {
    "id": 1,
    "email": "string",
    "nickname": "string",
    "code": "string",
    "profileImage": "string",
    "oneLiner": "string",
    "isGuest": true
  },
  "createdAt": 0
}

```

id

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||none|
|type|string|true|none||FRIEND_REQUEST(1),    // 친구 요청<br />FRIEND_ACCEPT(2),    // 친구 수락COORDINATION_REQUEST(3),    // 코디 요청<br />COORDINATION_RECOMMEND(4) // 코디 추천<br />COORDINATION_COPY(5),    // 코디 복사<br />COMMENT(6);     // 코디 댓글|
|title|string|true|none||제목|
|body|string|true|none||내용|
|isRead|boolean|true|none||읽음 여부|
|requester|[MemberInfo](#schemamemberinfo)|true|none||none|
|createdAt|number|true|none||none|

<h2 id="tocS_MemberInfo">MemberInfo</h2>

<a id="schemamemberinfo"></a>
<a id="schema_MemberInfo"></a>
<a id="tocSmemberinfo"></a>
<a id="tocsmemberinfo"></a>

```json
{
  "id": 1,
  "email": "string",
  "nickname": "string",
  "code": "string",
  "profileImage": "string",
  "oneLiner": "string",
  "isGuest": true
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||ID|
|email|string|true|none||이메일|
|nickname|string|true|none||닉네임|
|code|string|true|none||닉네임 중복 방지 코드|
|profileImage|string|true|none||프로필 이미지|
|oneLiner|string|true|none||한줄 소개|
|isGuest|boolean|true|none||게스트인지|

<h2 id="tocS_ClosetClothes">ClosetClothes</h2>

<a id="schemaclosetclothes"></a>
<a id="schema_ClosetClothes"></a>
<a id="tocSclosetclothes"></a>
<a id="tocsclosetclothes"></a>

```json
{
  "id": 1,
  "image": "string",
  "name": "string",
  "brandName": "string",
  "shopName": "string",
  "isPublic": true,
  "createdAt": "string"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||옷장 옷 ID|
|image|string|true|none||옷 이미지 url|
|name|string|true|none||옷 상품명|
|brandName|string|true|none||none|
|shopName|string|true|none||구매처|
|isPublic|boolean|true|none||none|
|createdAt|string|true|none||none|

<h2 id="tocS_CoordinationClothes1">CoordinationClothes1</h2>

<a id="schemacoordinationclothes1"></a>
<a id="schema_CoordinationClothes1"></a>
<a id="tocScoordinationclothes1"></a>
<a id="tocscoordinationclothes1"></a>

```json
{
  "id": 1,
  "image": "string",
  "position": {
    "x": 0,
    "y": 0,
    "z": 1
  },
  "scale": 0,
  "rotation": 0
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||코디 옷 ID|
|image|string|true|none||none|
|position|[Position](#schemaposition)|true|none||none|
|scale|number|true|none||none|
|rotation|number|true|none||none|

<h2 id="tocS_Coordination2">Coordination2</h2>

<a id="schemacoordination2"></a>
<a id="schema_Coordination2"></a>
<a id="tocScoordination2"></a>
<a id="tocscoordination2"></a>

```json
{
  "id": 0,
  "title": "string",
  "description": "string",
  "isPublic": true,
  "isTemplate": true,
  "thumbnail": "string",
  "createdAt": "string"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||코디 ID|
|title|string|true|none||코디 제목|
|description|string|true|none||코디 설명|
|isPublic|boolean|true|none||공개 여부|
|isTemplate|boolean|true|none||템플릿 OR 커스텀|
|thumbnail|string|true|none||썸네일 이미지 URL|
|createdAt|string|true|none||생성일|

<h2 id="tocS_CoordinationDetail">CoordinationDetail</h2>

<a id="schemacoordinationdetail"></a>
<a id="schema_CoordinationDetail"></a>
<a id="tocScoordinationdetail"></a>
<a id="tocscoordinationdetail"></a>

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "isPublic": true,
  "isTemplate": true,
  "thumbnail": "string",
  "items": [
    {
      "id": 1,
      "image": "string",
      "position": {
        "x": 0,
        "y": 0,
        "z": 1
      },
      "scale": 0,
      "rotation": 0
    }
  ],
  "creator": {
    "id": 1,
    "email": "string",
    "nickname": "string",
    "code": "string",
    "profileImage": "string",
    "oneLiner": "string",
    "isGuest": true
  },
  "owner": {
    "id": 1,
    "email": "string",
    "nickname": "string",
    "code": "string",
    "profileImage": "string",
    "oneLiner": "string",
    "isGuest": true
  },
  "createdAt": "string"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|string|true|none||코디 ID|
|title|string|true|none||none|
|description|string|true|none||none|
|isPublic|boolean|true|none||none|
|isTemplate|boolean|true|none||none|
|thumbnail|string|true|none||썸네일 이미지 URL|
|items|[[CoordinationClothes](#schemacoordinationclothes)]|true|none||코디에 사용된 옷들|
|creator|[Member](#schemamember)|true|none||코디 제안자 정보|
|owner|[Member](#schemamember)|true|none||코디 제안자 정보|
|createdAt|string|true|none||생성일|

<h2 id="tocS_FriendsItem">FriendsItem</h2>

<a id="schemafriendsitem"></a>
<a id="schema_FriendsItem"></a>
<a id="tocSfriendsitem"></a>
<a id="tocsfriendsitem"></a>

```json
{
  "id": 1,
  "nickname": "string",
  "code": "string",
  "profileImage": "string",
  "oneLiner": "string",
  "isGuest": true
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||ID|
|nickname|string|true|none||닉네임|
|code|string|true|none||닉네임 중복 방지 코드|
|profileImage|string|true|none||프로필 이미지|
|oneLiner|string|true|none||한줄 소개|
|isGuest|boolean|true|none||게스트인지|

<h2 id="tocS_FriendRequestRes">FriendRequestRes</h2>

<a id="schemafriendrequestres"></a>
<a id="schema_FriendRequestRes"></a>
<a id="tocSfriendrequestres"></a>
<a id="tocsfriendrequestres"></a>

```json
{
  "id": 0,
  "message": "string",
  "requester": {
    "id": 0,
    "profileImage": "string",
    "nickname": "string",
    "code": "string"
  }
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||친구 요청 ID|
|message|string|true|none||요청 메시지|
|requester|object|true|none||요청한 사람|
|» id|integer|true|none||요청한 사람 ID|
|» profileImage|string|true|none||요청한 사람 프로필 이미지|
|» nickname|string|true|none||요청한 사람 닉네임|
|» code|string|true|none||요청한 사람 코드|

<h2 id="tocS_MemberInfoDetail">MemberInfoDetail</h2>

<a id="schemamemberinfodetail"></a>
<a id="schema_MemberInfoDetail"></a>
<a id="tocSmemberinfodetail"></a>
<a id="tocsmemberinfodetail"></a>

```json
{
  "id": 1,
  "email": "string",
  "nickname": "string",
  "code": "string",
  "profileImage": "string",
  "oneLiner": "string",
  "isPublic": true,
  "notificationStatus": true,
  "createdAt": 0,
  "updatedAt": 0
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||ID|
|email|string|true|none||이메일|
|nickname|string|true|none||닉네임|
|code|string|true|none||닉네임 중복 방지 코드|
|profileImage|string|true|none||프로필 이미지|
|oneLiner|string|true|none||한줄 소개|
|isPublic|boolean|true|none||계정 공개 여부|
|notificationStatus|boolean|true|none||알림 설정|
|createdAt|number|true|none||가입일|
|updatedAt|number|true|none||수정일|

<h2 id="tocS_Comment3">Comment3</h2>

<a id="schemacomment3"></a>
<a id="schema_Comment3"></a>
<a id="tocScomment3"></a>
<a id="tocscomment3"></a>

```json
{
  "id": 0,
  "content": "string",
  "depth": 0,
  "parentId": 0,
  "creator": {
    "id": 1,
    "email": "string",
    "nickname": "string",
    "code": "string",
    "profileImage": "string",
    "oneLiner": "string",
    "isGuest": true
  },
  "createdAt": "string"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||댓글 ID|
|content|string|true|none||none|
|depth|integer|true|none||none|
|parentId|integer¦null|false|none||none|
|creator|[Member](#schemamember)|true|none||코디 제안자 정보|
|createdAt|string|true|none||none|

<h2 id="tocS_CoordinationShort">CoordinationShort</h2>

<a id="schemacoordinationshort"></a>
<a id="schema_CoordinationShort"></a>
<a id="tocScoordinationshort"></a>
<a id="tocscoordinationshort"></a>

```json
{
  "id": 0,
  "title": "string",
  "description": "string",
  "isPublic": true,
  "isTemplate": true,
  "thumbnail": "string",
  "createdAt": "string"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||코디 ID|
|title|string|true|none||코디 제목|
|description|string|true|none||코디 설명|
|isPublic|boolean|true|none||공개 여부|
|isTemplate|boolean|true|none||템플릿 OR 커스텀|
|thumbnail|string|true|none||코디 썸네일|
|createdAt|string|true|none||생성일|

<h2 id="tocS_ClosetClothesDetail">ClosetClothesDetail</h2>

<a id="schemaclosetclothesdetail"></a>
<a id="schema_ClosetClothesDetail"></a>
<a id="tocSclosetclothesdetail"></a>
<a id="tocsclosetclothesdetail"></a>

```json
{
  "id": 0,
  "image": "string",
  "name": "string",
  "brand": {
    "id": 0,
    "name": "string"
  },
  "shopName": "string",
  "color": {
    "id": 0,
    "name": "string",
    "hexCode": "string"
  },
  "category": {
    "id": 0,
    "name": "string"
  },
  "isPublic": "string",
  "createdAt": "string"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||ID|
|image|string|true|none||none|
|name|string|true|none||name|
|brand|object|true|none||none|
|» id|integer|true|none||none|
|» name|string|true|none||none|
|shopName|string|true|none||none|
|color|object|true|none||none|
|» id|integer|true|none||색상 ID|
|» name|string|true|none||색상 이름|
|» hexCode|string|true|none||색상 hexcode|
|category|object|true|none||none|
|» id|integer|true|none||카테고리 ID|
|» name|string|true|none||카테고리 이름|
|isPublic|string|true|none||none|
|createdAt|string|true|none||none|

<h2 id="tocS_CoordinationFriend">CoordinationFriend</h2>

<a id="schemacoordinationfriend"></a>
<a id="schema_CoordinationFriend"></a>
<a id="tocScoordinationfriend"></a>
<a id="tocscoordinationfriend"></a>

```json
{
  "owner": {
    "id": 1,
    "email": "string",
    "nickname": "string",
    "code": "string",
    "profileImage": "string",
    "oneLiner": "string",
    "isGuest": true
  },
  "coordinations": [
    {
      "id": 0,
      "title": "string",
      "description": "string",
      "isPublic": true,
      "isTemplate": true,
      "thumbnail": "string",
      "createdAt": "string"
    }
  ]
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|owner|[MemberInfo](#schemamemberinfo)|true|none||none|
|coordinations|[[Coordination2](#schemacoordination2)]|true|none||none|

<h2 id="tocS_Coordination4">Coordination4</h2>

<a id="schemacoordination4"></a>
<a id="schema_Coordination4"></a>
<a id="tocScoordination4"></a>
<a id="tocscoordination4"></a>

```json
{
  "title": "string",
  "description": "string",
  "isPublic": true,
  "isTemplate": true,
  "items": [
    {
      "id": 0,
      "position": {
        "x": 0,
        "y": 0,
        "z": 1
      },
      "scale": 0,
      "rotation": 0
    }
  ]
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|title|string|true|none||none|
|description|string|true|none||none|
|isPublic|boolean|true|none||none|
|isTemplate|boolean|true|none||none|
|items|[object]|true|none||none|
|» id|integer|true|none||옷장 옷 ID|
|» position|[Position](#schemaposition)|true|none||none|
|» scale|number|true|none||none|
|» rotation|number|true|none||none|

<h2 id="tocS_CoordinationClothes5">CoordinationClothes5</h2>

<a id="schemacoordinationclothes5"></a>
<a id="schema_CoordinationClothes5"></a>
<a id="tocScoordinationclothes5"></a>
<a id="tocscoordinationclothes5"></a>

```json
{
  "id": 1,
  "image": "string",
  "position": {
    "x": 0,
    "y": 0,
    "z": 1
  },
  "scale": 0,
  "rotation": 0
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|true|none||코디 옷 ID|
|image|string|true|none||none|
|position|[Position](#schemaposition)|true|none||none|
|scale|number|true|none||none|
|rotation|number|true|none||none|

