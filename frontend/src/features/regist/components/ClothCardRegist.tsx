import { ClosetApis, LibraryApis } from '@/features/regist/api/registApis';
import { useState, useEffect } from 'react';
import React from 'react';
import { ClothItem } from '@/components/cards/cloth-card/ClothCard.types';
import { useRegistCloth } from '@/hooks/useRegistCloth';
import { useDeleteCloth } from '@/hooks/useRegistCloth';

export interface ClothCardRegistProps {
	item: ClothItem;
	selected?: boolean;
	onClick?: () => void;
	className?: string;
}

interface RegisterState {
	isRegistered: boolean;
	id?: number;
}

// 선택 여부에 따라 테두리 색상 변경, 크기 동적 적용
export const ClothCardRegist = ({
	item,
	selected = false,
	className = '',
}: ClothCardRegistProps) => {
	const [regState, setRegState] = useState<RegisterState>({
		isRegistered: false,
		id: undefined,
	});

	// regState 변경 감지
	useEffect(() => {
		console.log('regState 변경됨:', regState);
	}, [regState]);

	const registerMutation = useRegistCloth(item.id);
	const deleteMutation = useDeleteCloth(regState.id);
	const busy = registerMutation.isPending || deleteMutation?.isPending;

	const handleRegist = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (busy || regState.isRegistered) return;

		registerMutation.mutate(undefined, {
			onSuccess: (data) => {
				const returnedId = data.content;
				console.log('regist 성공');
				console.log('data', data);
				setRegState({ isRegistered: true, id: returnedId });
			},
			onError: (err: any) => {
				if (err.response?.status === 409 && err.response.data?.content?.id) {
					const returnedId = err.response.data.content.id;
					setRegState({ isRegistered: true, id: returnedId });
				}
			},
		});
	};

	const handleDelete = (e: React.MouseEvent) => {
		console.log('delete 진행중');
		e.stopPropagation();
		if (busy || !regState.isRegistered || !regState.id) return;

		deleteMutation?.mutate(undefined, {
			onSuccess: () => {
				setRegState({ isRegistered: false, id: undefined });
			},
		});
	};

	return (
		<div className={className}>
			<div
				className={`w-full aspect-[10/11] border border-light overflow-hidden rounded-md relative`}
			>
				<img
					src={item.imageUrl || '/placeholder.svg?height=200&width=200'}
					alt={item.name}
					className='object-cover w-full'
				/>
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
					)}
				</button>
			</div>

			<div className='flex flex-col items-start gap-0.5 px-1'>
				<span className='w-full text-left text-smallDescription text-low'>
					{item.brand}
				</span>
				<span className='w-full text-left text-categoryButton text-regular'>
					{item.name}
				</span>
			</div>
		</div>
	);
};
