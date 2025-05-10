import React from 'react';

interface SelectMenuProps<T extends string> {
	menu: readonly T[];
	selected: T;
	setSelected: React.Dispatch<React.SetStateAction<T>>;
	className?: string;
}

const SelectMenu = <T extends string>({
	menu,
	selected,
	setSelected,
	className,
}: SelectMenuProps<T>) => (
	<div
		className={`flex w-full justify-between border-b border-light ${className}`}
	>
		{menu.map((item) => (
			<div
				key={item}
				onClick={() => setSelected(item)}
				className={`flex-1 py-3.5 text-topHeader ${
					selected === item
						? 'text-regular border-b-2 border-regular'
						: 'text-description'
				} cursor-pointer`}
			>
				{item}
			</div>
		))}
	</div>
);

export default SelectMenu;
