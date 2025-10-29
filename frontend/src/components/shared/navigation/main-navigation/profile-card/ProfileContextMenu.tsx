import { AlertDialog, Button, DropdownMenu, Flex } from '@radix-ui/themes';
import { PersonIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../../hooks/useAuth.tsx';

const ProfileContextMenu = () => {
  const { logout } = useAuth();

  return (
    <AlertDialog.Root>
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
        <AlertDialog.Trigger>
          <Flex direction="column" justify="center" align="center">
            <DropdownMenu.Item color="red">Logout</DropdownMenu.Item>
          </Flex>
        </AlertDialog.Trigger>
      </DropdownMenu.Content>
      <AlertDialog.Content maxWidth="20rem">
        <AlertDialog.Title>Logout</AlertDialog.Title>
        <AlertDialog.Description>
          Are you sure you want to log out?
        </AlertDialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={logout.trigger}>
              Logout
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default ProfileContextMenu;
