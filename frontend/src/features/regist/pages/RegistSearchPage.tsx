import SelectMenu from '@/components/menu/two-selection-menu/SelectMenu';
import { useState } from 'react';
import LibraryContainer from '@/features/regist/components/LibraryContainer';
import { registSearchMenuConfig } from '@/constants/registConfig';

const RegistSearchPage = () => {
	const [selected, setSelected] = useState<
		(typeof registSearchMenuConfig)[number]
	>(registSearchMenuConfig[0]);

	return (
		<div className='flex-1 w-full h-full flex flex-col items-center px-4 py-1 gap-5'>
			<SelectMenu
				menu={registSearchMenuConfig}
				selected={selected}
				setSelected={setSelected}
			/>

			<div className='flex-1 w-full '>
				{selected === registSearchMenuConfig[0] ? <LibraryContainer /> : <></>}
			</div>
		</div>
	);
};

export default RegistSearchPage;
