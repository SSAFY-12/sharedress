import SelectMenu from '@/components/menu/two-selection-menu/SelectMenu';
import { useState } from 'react';
import LibraryContainer from '@/features/regist/components/LibraryContainer';
import { registSearchMenuConst } from '@/constants/registConfig';

const RegistSearchPage = () => {
	const [selected, setSelected] = useState<
		(typeof registSearchMenuConst)[number]
	>(registSearchMenuConst[0]);

	return (
		<div className='flex-1 w-full h-full flex flex-col items-center px-4 py-1 gap-5'>
			<SelectMenu
				menu={registSearchMenuConst}
				selected={selected}
				setSelected={setSelected}
			/>
			{selected === registSearchMenuConst[0] ? (
				<>
					<LibraryContainer />
				</>
			) : (
				<></>
			)}
		</div>
	);
};
export default RegistSearchPage;
