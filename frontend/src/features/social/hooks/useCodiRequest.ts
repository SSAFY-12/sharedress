import { useMutation } from '@tanstack/react-query';
import { socialApi } from '@/features/social/api/socialApi';
import { useForm } from 'react-hook-form';

interface CodiRequestForm {
	receiverId: number;
	message: string;
}

export const useCodiRequest = (receiverId: number) => {
	const { register, handleSubmit, watch, setValue } = useForm<CodiRequestForm>({
		defaultValues: {
			receiverId: receiverId,
			message: '',
		},
	});

	const { mutate: requestCodi } = useMutation({
		mutationFn: (message: string) =>
			socialApi.requestFriendCodi(receiverId, message),
		onSuccess: () => {
			setValue('message', '');
		},
	});

	const onSubmit = handleSubmit((data) => {
		requestCodi(data.message);
	});

	return {
		register,
		watch,
		onSubmit,
		setValue,
	};
};
