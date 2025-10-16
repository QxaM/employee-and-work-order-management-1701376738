import { Avatar, Button, DropdownMenu } from '@radix-ui/themes';
import { useMeData } from '../../../../../hooks/useMeData.tsx';

interface ProfileAvatarProps {
  imageSrc: string | undefined;
}

const ProfileAvatar = ({ imageSrc }: ProfileAvatarProps) => {
  const { me } = useMeData();
  const firstLetter = me?.email.charAt(0).toUpperCase() ?? 'P';

  return (
    <DropdownMenu.Trigger>
      <Button variant="ghost">
        <Avatar
          src={imageSrc}
          fallback={firstLetter}
          variant="solid"
          highContrast
          className="!cursor-pointer"
        ></Avatar>
      </Button>
    </DropdownMenu.Trigger>
  );
};

export default ProfileAvatar;
