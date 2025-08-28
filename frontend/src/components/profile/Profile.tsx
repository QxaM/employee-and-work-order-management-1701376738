import {
  Avatar,
  Box,
  Flex,
  Grid,
  Heading,
  Link,
  Separator,
} from '@radix-ui/themes';
import { useMyProfileQuery } from '../../store/api/profile.ts';
import ProfileSection from './ProfileSection.tsx';
import ProfileItem from './ProfileItem.tsx';

const Profile = () => {
  const { data: profileData } = useMyProfileQuery();

  const firstNameFirstLetter = profileData?.firstName.charAt(0) ?? 'M';
  const lastNameFirstLetter = profileData?.lastName.charAt(0) ?? 'Q';
  const imageFallback = (
    firstNameFirstLetter + lastNameFirstLetter
  ).toUpperCase();

  return (
    <Flex direction="column" justify="center" align="center" m="6">
      <Heading as="h2">Profile</Heading>
      <Separator
        size="3"
        color="violet"
        className="!h-(--space-1)"
        mt="1"
        mb="6"
      />
      <Avatar size="9" radius="full" fallback={imageFallback} />
      <Grid
        columns={{ initial: '1', sm: '2' }}
        width="100%"
        mt="8"
        gap="4"
        align="start"
      >
        <ProfileSection title="Personal Information">
          <Grid columns="2" gap="4" minHeight="0">
            <ProfileItem isLoading={!profileData} title="First name">
              {profileData?.firstName ?? ''}
            </ProfileItem>
            <ProfileItem isLoading={!profileData} title="Middle name">
              {profileData?.middleName ?? ''}
            </ProfileItem>
            <Box gridColumnStart="1" gridColumnEnd="3">
              <ProfileItem isLoading={!profileData} title="Last name">
                {profileData?.lastName ?? ''}
              </ProfileItem>
            </Box>
          </Grid>
        </ProfileSection>
        <ProfileSection title="Email Address">
          <ProfileItem isLoading={!profileData}>
            <Link href={`mailto:${profileData?.email}`}>
              {profileData?.email ?? ''}
            </Link>
          </ProfileItem>
        </ProfileSection>
      </Grid>
    </Flex>
  );
};

export default Profile;
