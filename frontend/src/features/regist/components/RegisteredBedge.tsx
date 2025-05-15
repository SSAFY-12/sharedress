import { useDeleteCloth } from '@/features/regist/hooks/useRegistCloth';
import { useRegistCloth } from '@/features/regist/hooks/useRegistCloth';
import React from 'react';
import { useClosetStore } from '@/store/useClosetStore';
import { useState, useEffect } from 'react';

interface RegisterState {
	isRegistered: boolean;
	closetId: number | undefined;
}

export const RegisteredBedge = ({ libraryId }: { libraryId: number }) => {
	const itemList = useClosetStore((state) => state.getCloset());
	const [regState, setRegState] = useState<RegisterState>({
		isRegistered: false,
		closetId: undefined,
	});

	useEffect(() => {
		const found = itemList.find((item) => item.libraryId === libraryId);
		if (found) {
			setTimeout(() => {
				setRegState({ isRegistered: true, closetId: found.closetId });
			}, 0);
		}
	}, [itemList, libraryId]);

	const registerMutation = useRegistCloth(libraryId);
	const deleteMutation = useDeleteCloth(regState.closetId);
	const busy = registerMutation.isPending || deleteMutation?.isPending;

	const handleRegist = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (busy || regState.isRegistered) return;

		registerMutation.mutate(undefined, {
			onSuccess: (data) => {
				const returnedId = data.content;
				setRegState({ isRegistered: true, closetId: returnedId });
			},
			onError: (err: any) => {
				if (err.response?.status === 409 && err.response.data?.content?.id) {
					const returnedId = err.response.data.content.id;
					setRegState({ isRegistered: true, closetId: returnedId });
				}
			},
		});
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (busy || !regState.isRegistered || !regState.closetId) return;

		deleteMutation?.mutate(undefined, {
			onSuccess: () => {
				setRegState({ isRegistered: false, closetId: undefined });
			},
		});
	};

	return (
		<div>
			<button
				onClick={regState.isRegistered ? handleDelete : handleRegist}
				disabled={busy}
				className={`absolute top-3 right-3 rounded-full p-2 flex items-center justify-center transition-all duration-300 ease-in-out ${
					regState.isRegistered
						? 'bg-success/70'
						: busy
						? 'bg-regular/70'
						: 'bg-regular/50'
				}`}
			>
				{regState.isRegistered ? (
					<img src='/icons/check.svg' alt='registered' className='w-4 h-4' />
				) : busy ? (
					<img src='/icons/loading.svg' alt='loading' className='w-4 h-4' />
				) : (
					<img src='/icons/plus_bold.svg' alt='plus' className='w-4 h-4' />
				)}{' '}
			</button>
		</div>
	);
};
