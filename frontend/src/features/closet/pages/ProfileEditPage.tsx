import { useMyProfile } from '../hooks/useMyProfile';

const ProfileEditPage = () => {
	const { data: profile } = useMyProfile();

	return (
		<div>
			<h1>프로필 수정</h1>
		</div>
	);
};

export default ProfileEditPage;
