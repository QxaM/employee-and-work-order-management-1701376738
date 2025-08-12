import {
  Code,
  DataList,
  Flex,
  Heading,
  IconButton,
  Link,
  Section,
} from '@radix-ui/themes';
import { CopyIcon } from '@radix-ui/react-icons';
import { copyToClipboard } from '../../../utils/clipboard.ts';

interface UserSectionProps {
  title: string;
  userId: number;
  email: string;
}

/**
 * Renders a user section component with a title, user ID, and email information.
 *
 * This component is structured as a section element, containing a heading
 * for the title and display fields for showing the user ID and email
 *
 * @param {Object} props - The component's props object.
 * @param {string} props.title - The title of the section.
 * @param {string} props.userId - The unique identifier of the user.
 * @param {string} props.email - The email address of the user.
 */
const UserSection = ({ title, userId: id, email }: UserSectionProps) => {
  return (
    <Section aria-labelledby="roles-update-user-data" p="0">
      <Flex
        direction="column"
        gap="4"
        p="2"
        flexGrow="1"
        width="100%"
        height="100%"
      >
        <Heading
          as="h4"
          size="2"
          weight="bold"
          id="roles-update-user-data"
          className="uppercase"
        >
          {title}
        </Heading>
        <DataList.Root
          orientation="horizontal"
          size="2"
          className="!gap-y-(--space-2)"
        >
          <DataList.Item align="start">
            <DataList.Label>User ID</DataList.Label>
            <DataList.Value>
              <Flex gap="2" justify="center" align="center">
                <Code variant="ghost">{id}</Code>
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
            </DataList.Value>
          </DataList.Item>
          <DataList.Item align="start">
            <DataList.Label>User email</DataList.Label>
            <DataList.Value>
              <Link href={`mailto:${email}`}>{email}</Link>
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </Flex>
    </Section>
  );
};

export default UserSection;
