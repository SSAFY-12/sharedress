import { useEffect, useState, createContext, useContext } from 'react';
import { X } from 'lucide-react';
import {
	ModalContextType,
	ModalProps,
	ModalCloseProps,
	ModalHeaderProps,
	ModalBodyProps,
	ModalFooterProps,
} from './MainModal.types';
import { CN } from '@/lib/utils';

// 이 Context는 모달의 상태(isOpen)와 닫기 함수(onClose)를 자식 컴포넌트들에게 전달
const ModalContext = createContext<ModalContextType | undefined>(undefined);
// context를 사용할 때 실수로 Provider밖에서 사용하는 것 방지

// 자식 컴포넌트에서 모달의 상태와 닫기 함수를 쉽게 사용
const useModalContext = () => {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error('Modal 컴포넌트 내부에서만 사용할 수 있습니다');
	}
	return context;
};

// 메인 모달 컴포넌트
export const MainModal = ({
	isOpen,
	onClose,
	children,
	className,
}: ModalProps) => {
	// 모달의 애니메이션을 위한 상태
	const [isVisible, setIsVisible] = useState(false);

	// 모달이 열리거나 닫힐 때 실행되는 효과
	useEffect(() => {
		if (isOpen) {
			setIsVisible(true);
			// 모달에 집중할 수 있도록 배경 스크롤 방지
			document.body.style.overflow = 'hidden';
		} else {
			const timer = setTimeout(() => {
				setIsVisible(false);
			}, 300);
			// 스크롤 복원 -> 사용자가 배경 스크롤을 할 수 있도록 복구
			document.body.style.overflow = '';
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	if (!isVisible) return null;

	return (
		// Context.Provider로 자식 컴포넌트들에게 모달의 상태와 닫기 함수를 전달
		<ModalContext.Provider value={{ isOpen, onClose }}>
			{/* 모달 오버레이 (배경) */}
			<div
				className={CN(
					'fixed inset-0 z-50 flex items-center justify-center duration-300 px-7 bg-black bg-opacity-50 z-40 backdrop-blur-sm',
				)}
				onClick={(e) => {
					if (e.target === e.currentTarget) onClose(); // 배경 클릭 시 모달 닫기
				}}
			>
				{/* 모달 컨텐츠 */}
				<div
					className={CN(
						'relative max-h-[90vh] w-full max-w-md overflow-auto rounded-xl bg-white shadow-lg transition-all duration-300',
						isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
						className,
					)}
					onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록
				>
					{children}
				</div>
			</div>
		</ModalContext.Provider>
	);
};

// -----------------------------------
// 모달의 서브 컴포넌트들 === 컴포넌트 합성의 패턴

// 닫기 버튼 컴포넌트
const Close = ({ className }: ModalCloseProps) => {
	// Context에서 닫기 함수를 가져옴
	const { onClose } = useModalContext();
	return (
		<button
			onClick={onClose}
			className={CN(
				'absolute right-3 top-3 p-1 text-low hover:text-gray-700',
				className,
			)}
			aria-label='닫기'
		>
			<X size={20} />
		</button>
	);
};

// 헤더 컴포넌트
const Header = ({
	children,
	className,
	showCloseButton = true,
}: ModalHeaderProps) => (
	<div className={CN('relative pt-6', className)}>
		{showCloseButton && <MainModal.Close />}
		{children}
	</div>
);

// 본문 컴포넌트
const Body = ({ children, className }: ModalBodyProps) => (
	<div className={CN('px-5 pb-5', className)}>{children}</div>
);

// 푸터 컴포넌트
const Footer = ({ children, className }: ModalFooterProps) => (
	<div className={CN('border-t px-6 py-4', className)}>{children}</div>
);

// 컴포넌트 할당
Footer.displayName = 'MainModal.Footer';
Body.displayName = 'MainModal.Body';
Header.displayName = 'MainModal.Header';
Close.displayName = 'MainModal.Close'; //컴포넌트 정의후 속성 설정 -> 타입추론과 디버깅을 위함

// 서브컴포넌트 연결
MainModal.Footer = Footer;
MainModal.Body = Body;
MainModal.Header = Header;
MainModal.Close = Close;
