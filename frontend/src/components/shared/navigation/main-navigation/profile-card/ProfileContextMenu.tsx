import { DropdownMenu, Flex } from '@radix-ui/themes';
import { PersonIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../../hooks/useAuth.tsx';

const ProfileContextMenu = () => {
  const { logout } = useAuth();

  return (
    <DropdownMenu.Content variant="soft" size="2">
      <DropdownMenu.Item asChild>
        <Link to="/profile">
          <Flex justify="center" align="center" gap="2">
            Profile
            <PersonIcon />
          </Flex>
        </Link>
      </DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item
        color="red"
        className="flex justify-center items-center"
        onClick={logout.trigger}
      >
        Logout
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  );
};

export default ProfileContextMenu;
