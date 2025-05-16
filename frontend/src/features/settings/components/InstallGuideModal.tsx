import { MainModal } from '@/components/modals/main-modal';
import {
	Share2,
	Plus,
	Smartphone,
	Download,
	CheckCircle,
	Home,
} from 'lucide-react';

interface InstallGuideModalProps {
	isOpen: boolean;
	onClose: () => void;
	type: 'ios' | 'android';
}

export const InstallGuideModal = ({
	isOpen,
	onClose,
	type,
}: InstallGuideModalProps) => {
	const isIOS = type === 'ios';
	const title = isIOS
		? '아이폰에서 앱 설치하기'
		: '갤럭시/안드로이드에서 앱 설치하기';
	const description = isIOS
		? 'Safari 브라우저에서 다음 단계를 따라 홈 화면에 앱을 추가하세요.'
		: 'Chrome 브라우저에서 다음 단계를 따라 앱을 설치하세요.';

	const steps = isIOS
		? [
				{
					title: 'Safari 브라우저에서 공유 버튼을 탭하세요',
					icon: <Share2 className='w-8 h-8 text-blue-500 my-2' />,
					description: 'Safari 하단에 있는 공유 아이콘을 탭하세요',
				},
				{
					title: '"홈 화면에 추가" 옵션을 선택하세요',
					icon: <Plus className='w-8 h-8 text-blue-500 my-2' />,
					description:
						'공유 메뉴에서 스크롤을 내려 "홈 화면에 추가" 옵션을 찾으세요',
				},
				{
					title: '"추가"를 탭하세요',
					icon: <CheckCircle className='w-8 h-8 text-blue-500 my-2' />,
					description:
						'앱 이름과 아이콘을 확인한 후 오른쪽 상단의 "추가" 버튼을 탭하세요',
				},
				{
					title: '홈 화면에서 앱 아이콘을 확인하세요',
					icon: <Home className='w-8 h-8 text-blue-500 my-2' />,
					description:
						'이제 홈 화면에서 앱 아이콘을 찾을 수 있으며, 앱처럼 사용할 수 있습니다',
				},
		  ]
		: [
				{
					title: 'Chrome 브라우저에서 메뉴 버튼(⋮)을 탭하세요',
					icon: <Smartphone className='w-8 h-8 text-blue-500 my-2' />,
					description: 'Chrome 상단 오른쪽에 있는 메뉴 아이콘(⋮)을 탭하세요',
				},
				{
					title: '"앱 설치" 또는 "홈 화면에 추가" 옵션을 선택하세요',
					icon: <Download className='w-8 h-8 text-blue-500 my-2' />,
					description:
						'메뉴에서 "앱 설치" 또는 "홈 화면에 추가" 옵션을 찾아 탭하세요',
				},
				{
					title: '"설치"를 탭하세요',
					icon: <CheckCircle className='w-8 h-8 text-blue-500 my-2' />,
					description: '확인 창이 나타나면 "설치" 버튼을 탭하세요',
				},
				{
					title: '홈 화면에서 앱 아이콘을 확인하세요',
					icon: <Home className='w-8 h-8 text-blue-500 my-2' />,
					description:
						'설치가 완료되면 홈 화면이나 앱 서랍에서 앱 아이콘을 찾을 수 있습니다',
				},
		  ];

	return (
		<MainModal isOpen={isOpen} onClose={onClose} className='max-w-lg'>
			<MainModal.Header>
				<h3 className='text-center text-lg font-medium px-6'>{title}</h3>
			</MainModal.Header>
			<MainModal.Body className='space-y-6'>
				<p className='text-center text-sm text-gray-600'>{description}</p>

				<div className='space-y-8'>
					{steps.map((step, index) => (
						<div key={index} className='mb-4'>
							<div className='flex items-center gap-2 mb-1'>
								<div className='bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-base font-semibold'>
									{index + 1}
								</div>
								<span className='font-semibold text-base text-left break-words'>
									{step.title}
								</span>
							</div>
							<div className='flex items-center gap-2'>
								<span>{step.icon}</span>
								<span className='text-sm text-gray-600 text-left break-words'>
									{step.description}
								</span>
							</div>
						</div>
					))}
				</div>

				<div className='pt-4'>
					<button
						className='w-full py-3 bg-gray-900 rounded-md text-white font-medium hover:bg-gray-800 transition-colors'
						onClick={onClose}
					>
						확인
					</button>
				</div>
			</MainModal.Body>
		</MainModal>
	);
};
