import { ClosetApis, LibraryApis } from '@/features/regist/api/registApis';
import { ClothCardRegistProps } from './ClothCardRegist.types';
import { useState } from 'react';
import React from 'react';

// 선택 여부에 따라 테두리 색상 변경, 크기 동적 적용
export const ClothCardRegist = ({
	item,
	selected = false,
	onClick,
	className = '',
}: ClothCardRegistProps) => {
	const [isRegistered, setIsRegistered] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleRegist = async (e: React.MouseEvent) => {
		e.stopPropagation(); // 부모의 onClick 이벤트 전파 방지
		if (isLoading || isRegistered) return;

		try {
			setIsLoading(true);
			await LibraryApis.registCloth(item.id);
			setIsRegistered(true);
		} catch (error) {
			console.error('옷장 등록 실패:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (e: React.MouseEvent) => {
		e.stopPropagation(); // 부모의 onClick 이벤트 전파 방지
		if (isLoading || !isRegistered) return;

		try {
			setIsLoading(true);
			await ClosetApis.deleteCloth(item.id);
			setIsRegistered(false);
		} catch (error) {
			console.error('옷장 삭제 실패:', error);
		} finally {
			setIsLoading(false);
		}
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
					onClick={isRegistered ? handleDelete : handleRegist}
					disabled={isLoading}
					className={`absolute top-3 right-3 rounded-full p-2 flex items-center justify-center transition-all duration-300 ease-in-out ${
						isRegistered
							? 'bg-success/70'
							: isLoading
							? 'bg-regular/70'
							: 'bg-regular/50'
					}`}
				>
					{isRegistered ? (
						<img src='/icons/check.svg' alt='registered' className='w-4 h-4' />
					) : isLoading ? (
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
