import Profile from '../components/profile/Profile.tsx';
import BasePage from './base/BasePage.tsx';

const ProfilePage = () => {
  return (
    <BasePage className="!w-full">
      <Profile />
    </BasePage>
  );
};

export default ProfilePage;
