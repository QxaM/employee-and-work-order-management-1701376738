import { DropdownMenu } from '@radix-ui/themes';
import ProfileAvatar from './ProfileAvatar.tsx';
import ProfileContextMenu from './ProfileContextMenu.tsx';

const ProfileCard = () => {
  return (
    <DropdownMenu.Root>
      <ProfileAvatar />
      <ProfileContextMenu />
    </DropdownMenu.Root>
  );
};

export default ProfileCard;
