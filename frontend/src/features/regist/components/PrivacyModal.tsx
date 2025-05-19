import { PrimaryBtn } from '@/components/buttons/primary-button/PrimaryBtn';
import { MainModal } from '@/components/modals/main-modal/MainModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface PrivacyModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAgree: () => void;
}

const PRIVACY_TEXT = `제1조 (목적)
본 동의서는 회원이 무신사 또는 29CM의 계정 정보를 입력하여 본인의 구매내역을 수집·활용하고자 하는 경우, 해당 계정 정보의 일시적 수집 및 이용에 대해 명확히 안내하고, 회원의 동의를 얻기 위한 것입니다.

제2조 (수집하는 항목 및 방식)
수집 항목

무신사/29CM 계정의 아이디(ID), 비밀번호(PW)

수집 방법

사용자가 직접 입력한 계정 정보를 이용하여 1회성 로그인 및 구매내역 조회 목적에 한해 사용됩니다.

수집된 계정 정보는 저장되지 않으며, 자동으로 폐기됩니다.

제3조 (수집 및 이용 목적)
본인의 무신사 또는 29CM 구매내역을 자동으로 수집하여, 회원의 디지털 옷장 기능을 보다 편리하게 이용할 수 있도록 하기 위함입니다.

수집된 정보는 아래 목적으로만 사용되며, 그 외 목적에는 절대 사용되지 않습니다.

무신사/29CM 로그인

구매내역 페이지 접근

구매 상품 정보 추출 및 옷장 등록

제4조 (보관 및 파기)
사용자의 계정 정보는 로그인 및 크롤링이 종료된 즉시 자동 폐기되며, 데이터베이스 또는 로그에 저장되지 않습니다.

저장 또는 로그 기록을 하지 않으며, 단일 세션 메모리에서만 처리됩니다.

파기 방식: 메모리 내에서 참조 제거 및 변수 초기화 처리

제5조 (법적 고지 및 이용자 책임)
무신사 및 29CM는 자체 이용약관에서 자동화 수단에 의한 데이터 수집을 제한할 수 있으며, 크롤링이 서비스 정책에 위반될 수 있습니다.

본 서비스는 회원의 자발적 입력 및 동의 하에 정보를 수집하며, 무신사 또는 29CM의 공식 API 또는 제휴 시스템이 아닌 점을 안내드립니다.

이로 인해 발생할 수 있는 계정 접근 제한, 비밀번호 변경 요청, 서비스 이용 정지 등은 당사가 책임지지 않습니다.

제6조 (동의의 거부 권리 및 서비스 제한)
회원은 본 동의에 대해 거부할 수 있으며, 거부하더라도 서비스 이용에 제한은 없습니다.

다만, 구매내역 기반 옷장 등록 기능은 이용하실 수 없습니다.

제7조 (보안조치)
당사는 회원의 개인정보를 안전하게 보호하기 위하여 다음과 같은 조치를 적용합니다.

계정 정보는 전송 시 SSL(HTTPS) 암호화를 적용하여 안전하게 처리됩니다.

입력된 정보는 서버 메모리에만 일시적으로 존재하며, 물리적/논리적 저장장치는 사용되지 않습니다.

로그인 실패 또는 절차 완료 시, 계정 정보는 즉시 삭제 처리됩니다.`;

const PrivacyModal = ({ isOpen, onClose, onAgree }: PrivacyModalProps) => {
	const navigate = useNavigate();

	const handleDisagree = () => {
		toast.error(
			<div className='flex flex-col gap-1 items-start'>
				<p>개인정보 동의를 거부할 경우</p>
				<p>서비스 이용이 제한됩니다</p>
			</div>,
		);
		navigate('/regist'); // 이전 페이지로 이동
	};

	const handleClose = () => {
		onClose();
		toast.error(
			<div className='flex flex-col gap-1 items-start'>
				<p>개인정보 동의를 거부할 경우</p>
				<p>서비스 이용이 제한됩니다</p>
			</div>,
		);
		navigate('/regist'); // 동의 없이 닫을 경우도 뒤로
	};

	return (
		<MainModal isOpen={isOpen} onClose={handleClose}>
			<MainModal.Header showCloseButton={true}>
				<h2 className='text-topHeader text-regular text-center px-5'>
					무신사/29CM 계정 정보 활용 동의서
				</h2>
			</MainModal.Header>
			<MainModal.Body>
				<div className='max-h-[60vh] bg-background overflow-y-auto whitespace-pre-wrap text-default text-low text-left mt-6 p-2'>
					{PRIVACY_TEXT}
				</div>
			</MainModal.Body>
			<div className='sticky bottom-0 bg-white border-t px-6 py-4 flex gap-2 justify-between'>
				<PrimaryBtn
					name='비동의'
					size='medium'
					color='gray'
					onClick={handleDisagree}
				/>
				<PrimaryBtn name='동의' size='medium' onClick={onAgree} />
			</div>
		</MainModal>
	);
};

export default PrivacyModal;
