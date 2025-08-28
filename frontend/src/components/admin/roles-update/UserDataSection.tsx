import { Code, Flex, IconButton, Link, Separator, Text, } from '@radix-ui/themes';
import { CopyIcon } from '@radix-ui/react-icons';
import { copyToClipboard } from '../../../utils/clipboard.ts';
import { Label } from 'radix-ui';
import { UserType } from '../../../types/api/UserTypes.ts';
import ShieldIcon from '../../icons/ShieldIcon.tsx';

interface UserSectionProps {
  user: UserType;
}

/**
 * Renders a user section component with a title, user ID, and email information.
 *
 * This component is structured as a section element, containing a heading
 * for the title and display fields for showing the user ID and email
 *
 * @param {Object} props - The component's props object.
 * @param {UserType} props.user - The user data object
 */
const UserDataSection = ({ user }: UserSectionProps) => {
  const { id, email } = user;

  return (
    <Flex direction="row" justify="between" align="center" width="100%">
      <Flex direction="row" align="center" gap="3">
        <Flex direction="row" gap="1" align="center">
          <Label.Root htmlFor="user-id" className="text-(--gray-a10)">
            ID:
          </Label.Root>
          <Flex gap="1" justify="center" align="center" ml="1">
            <Code variant="ghost" id="user-id" weight="medium">
              {id}
            </Code>
            <IconButton
              color="gray"
              size="1"
              aria-label="Copy user ID"
              variant="ghost"
              onClick={() => void copyToClipboard(id.toString())}
            >
              <CopyIcon />
            </IconButton>
          </Flex>
        </Flex>
        <Separator orientation="vertical" size="1" />
        <Link href={`mailto:${email}`}>{email}</Link>
      </Flex>
      <Flex direction="row" align="stretch" gap="2">
        <ShieldIcon className="size-(--font-size-3) text-(--gray-a9)" />
        <Text align="center" size="2" className="text-(--gray-a10)">
          {user.roles.length} role{user.roles.length !== 1 ? 's' : ''}
        </Text>
      </Flex>
    </Flex>
  );
};

export default UserDataSection;
