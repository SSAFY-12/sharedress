export class APIError extends Error {
	// 생성자 추가
	constructor(public status: number, message: string, public data?: any) {
		super(message); // 부모 클래스의 생성자 호출
		this.name = 'APIError'; // 오류 이름 설정
	}
}

export const getErrorMessage = (status: number): string => {
	switch (status) {
		case 400:
			return '잘못된 요청입니다.';
		case 401:
			return '인증이 필요합니다.';
		case 403:
			return '접근 권한이 없습니다.';
		case 404:
			return '요청한 리소스를 찾을 수 없습니다.';
		case 500:
			return '서버 오류가 발생했습니다.';
		default:
			return '알 수 없는 오류가 발생했습니다.';
	}
};
