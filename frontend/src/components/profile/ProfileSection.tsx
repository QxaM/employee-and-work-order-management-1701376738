import { Box, Card, DataList, Flex, Heading } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';
import { IconType } from '../../types/components/BaseTypes.ts';

interface ProfileSectionProps {
  title: string;
  icon: IconType;
}

const ProfileSection = ({
  title,
  icon: Icon,
  children,
}: PropsWithChildren<ProfileSectionProps>) => {
  return (
    <Card>
      <Box p="2">
        <Flex direction="row" justify="start" align="center" gap="2">
          <Icon className="size-(--font-size-4) text-(--accent-11)" />
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
