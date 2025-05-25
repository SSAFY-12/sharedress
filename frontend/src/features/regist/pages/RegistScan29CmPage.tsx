import { useForm } from 'react-hook-form';
import { useScanCloth } from '@/features/regist/hooks/useScanCloth';
import LoadingOverlay from '@/components/etc/LodaingOverlay';
import Header from '@/components/layouts/Header';
import { useNavigate } from 'react-router-dom';
interface Two9cmForm {
	id: string;
	password: string;
}

const RegistScan29CmPage = () => {
	const navigate = useNavigate();
	const { mutate: scanCloth, isPending } = useScanCloth();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Two9cmForm>();

	const onSubmit = (data: Two9cmForm) => {
		scanCloth({
			shopId: 3,
			id: data.id,
			password: data.password,
		});
	};

	const onBackClick = () => {
		navigate('/regist/scan');
	};

	return (
		<div className='flex-1 w-full h-full flex flex-col justify-start items-center pb-5 gap-4'>
			<Header
				showBack={true}
				onBackClick={onBackClick}
				subtitle='29cm 구매내역 스캔'
				className='w-full'
			/>
			<div className='flex-1 w-full h-full flex flex-col justify-start items-center py-5 px-4 gap-4 '>
				{isPending && <LoadingOverlay />}
				<div className='w-full max-w-md text-left'>
					<h1 className='text-black text-2xl font-bold mb-2'>29CM에</h1>
					<h1 className='text-black text-2xl font-bold mb-4'>
						오신 것을 환영해요!
					</h1>
				</div>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='w-full max-w-md flex flex-col gap-4'
				>
					<div className='flex flex-col gap-2 w-full'>
						<input
							id='id-29cm'
							type='text'
							{...register('id', { required: '아이디를 입력해주세요' })}
							className='w-full px-4 py-2 text-default text-black border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black'
							placeholder='아이디'
						/>
						{errors.id && (
							<p className='text-red-500 text-sm'>{errors.id.message}</p>
						)}
					</div>

					<div className='flex flex-col gap-2'>
						<input
							id='password-29cm'
							type='password'
							{...register('password', {
								required: '비밀번호를 입력해주세요',
							})}
							className='w-full px-4 py-2 border text-default text-black border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black'
							placeholder='비밀번호'
						/>
						{errors.password && (
							<p className='text-red-500 text-sm'>{errors.password.message}</p>
						)}
					</div>

					<button
						type='submit'
						disabled={isPending}
						className='w-full py-3 mt-1 bg-black text-white rounded-lg hover:bg-black/80 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{isPending ? '스캔 중...' : '구매내역 스캔하기'}
					</button>
				</form>
			</div>
		</div>
	);
};

export default RegistScan29CmPage;
