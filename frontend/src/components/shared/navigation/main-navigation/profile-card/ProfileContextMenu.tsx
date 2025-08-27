import { DropdownMenu, Flex } from '@radix-ui/themes';
import { useAppDispatch } from '../../../../../hooks/useStore.tsx';
import { logout } from '../../../../../store/authSlice.ts';
import { PersonIcon } from '@radix-ui/react-icons';

const ProfileContextMenu = () => {
  const dispatch = useAppDispatch();

  return (
    <DropdownMenu.Content variant="soft" size="2">
      <DropdownMenu.Item>
        <Flex justify="center" align="center" gap="2">
          Profile <PersonIcon />
        </Flex>
      </DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item
        color="red"
        className="flex justify-center items-center"
        onClick={() => dispatch(logout())}
      >
        Logout
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  );
};

export default ProfileContextMenu;
