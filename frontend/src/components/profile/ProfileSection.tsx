import { Box, Card, DataList, Flex, Heading } from '@radix-ui/themes';
import { PersonIcon } from '@radix-ui/react-icons';
import { PropsWithChildren } from 'react';

interface ProfileSectionProps {
  title: string;
}

const ProfileSection = ({
  title,
  children,
}: PropsWithChildren<ProfileSectionProps>) => {
  return (
    <Card>
      <Box p="2">
        <Flex direction="row" justify="start" align="center" gap="2">
          <PersonIcon className="size-(--font-size-4) text-(--accent-11)" />
          <Heading as="h3" size="2" weight="medium" trim="both">
            {title}
          </Heading>
        </Flex>
        <DataList.Root orientation="vertical" mt="5">
          {children}
        </DataList.Root>
      </Box>
    </Card>
  );
};

export default ProfileSection;
