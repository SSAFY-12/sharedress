import { HeaderProps } from '@/components/layouts/Header';
import { headerConfig } from '@/constants/headerConfig';
import { matchPath } from 'react-router-dom';

const getHeaderProps = (path: string): Partial<HeaderProps> => {
	for (const pattern in headerConfig) {
		const match = matchPath({ path: pattern, end: true }, path);
		if (match) {
			return headerConfig[pattern];
		}
	}
	return {
		showBack: false,
		subtitle: '',
		badgeIcon: 'info',
		badgeText: '',
	};
};

export default getHeaderProps;
