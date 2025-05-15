import { SwitchToggle } from '@/components/buttons/switch-toggle';
import { InputField } from '@/components/inputs/input-field';
import { ChangeEvent } from 'react';

interface CodiSaveBottomSectionProps {
	description: string;
	isPublic: boolean;
	isLoading: boolean;
	onDescriptionChange: (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => void;
	onPublicToggle: () => void;
	mode: 'my' | 'recommended';
}

const CodiSaveBottomSection = ({
	description,
	isPublic,
	isLoading,
	onDescriptionChange,
	onPublicToggle,
	mode,
}: CodiSaveBottomSectionProps) => (
	<div className='p-4 flex-1'>
		{isLoading ? (
			<div className='flex-1 flex items-center justify-center'>
				<p className='text-description'>저장 중...</p>
			</div>
		) : (
			<>
				<div className='mb-9'>
					<label
						htmlFor='description'
						className='block text-description text-low mb-2 text-left'
					>
						코디 설명
					</label>
					<InputField
						type='text'
						placeholder='어떤 코디인가요?'
						value={description}
						onChange={onDescriptionChange}
					/>
				</div>
				{mode === 'my' && (
					<div className='flex items-center justify-between'>
						<span className='text-default text-regular'>
							다른 사람에게 공개
						</span>
						<SwitchToggle checked={isPublic} onToggle={onPublicToggle} />
					</div>
				)}
			</>
		)}
	</div>
);

export default CodiSaveBottomSection;
