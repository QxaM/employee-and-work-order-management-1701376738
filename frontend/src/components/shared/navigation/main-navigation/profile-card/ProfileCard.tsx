import { DropdownMenu } from '@radix-ui/themes';
import ProfileAvatar from './ProfileAvatar.tsx';
import ProfileContextMenu from './ProfileContextMenu.tsx';
import { useProfileImage } from '../../../../../hooks/useProfileImage.tsx';

const ProfileCard = () => {
  const { imageSrc, clearImage } = useProfileImage();
  return (
    <DropdownMenu.Root>
      <ProfileAvatar imageSrc={imageSrc} />
      <ProfileContextMenu clearImage={clearImage} />
    </DropdownMenu.Root>
  );
};

export default ProfileCard;
