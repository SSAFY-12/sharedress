import { useForm } from 'react-hook-form';
import { useScanCloth } from '@/features/regist/hooks/useScanCloth';
import LoadingOverlay from '@/components/etc/LodaingOverlay';
import Header from '@/components/layouts/Header';
import { useNavigate } from 'react-router-dom';
interface MusinsaForm {
	id: string;
	password: string;
}

const RegistScanMusinsaPage = () => {
	const navigate = useNavigate();
	const { mutate: scanCloth, isPending } = useScanCloth();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<MusinsaForm>();

	const onSubmit = (data: MusinsaForm) => {
		scanCloth({
			shopId: 1,
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
				subtitle='무신사 구매내역 스캔'
				className='w-full'
			/>
			<div className='flex-1 w-full h-full flex flex-col justify-start items-center py-5 px-4 gap-4 '>
				{isPending && <LoadingOverlay />}
				<h1 className='text-black text-2xl text-semibold mb-2'>MUSINSA</h1>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='w-full max-w-md flex flex-col gap-4'
				>
					<div className='flex flex-col gap-2 w-full'>
						<input
							id='id'
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
							id='password'
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

export default RegistScanMusinsaPage;
