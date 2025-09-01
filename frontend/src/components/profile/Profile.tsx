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
import { FormEvent, useState } from 'react';
import Form from '../shared/form/Form.tsx';
import ProfileControls from './ProfileControls.tsx';

const Profile = () => {
  const { data: profileData } = useMyProfileQuery();
  const [isEdited, setIsEdited] = useState(false);

  const firstNameFirstLetter = profileData?.firstName.charAt(0) ?? 'M';
  const lastNameFirstLetter = profileData?.lastName.charAt(0) ?? 'Q';
  const imageFallback = (
    firstNameFirstLetter + lastNameFirstLetter
  ).toUpperCase();

  const handleEdit = () => {
    setIsEdited(true);
  };
  const handleCancel = () => {
    setIsEdited(false);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

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

      <Form handleSubmit={handleSubmit} className="w-full">
        <Grid
          columns={{ initial: '1', sm: '2' }}
          width="100%"
          mt="8"
          gap="4"
          align="start"
        >
          <ProfileSection title="Personal Information">
            <Grid columns="2" gap="4" minHeight="0">
              <ProfileItem
                isEdited={isEdited}
                isLoading={!profileData}
                title="First name"
              >
                {profileData?.firstName ?? ''}
              </ProfileItem>
              <ProfileItem
                isEdited={isEdited}
                isLoading={!profileData}
                title="Middle name"
              >
                {profileData?.middleName ?? ''}
              </ProfileItem>
              <Box gridColumnStart="1" gridColumnEnd="3">
                <ProfileItem
                  isEdited={isEdited}
                  isLoading={!profileData}
                  title="Last name"
                >
                  {profileData?.lastName ?? ''}
                </ProfileItem>
              </Box>
            </Grid>
          </ProfileSection>
          <ProfileSection title="Email Address">
            <ProfileItem isEdited={false} isLoading={!profileData}>
              <Link href={`mailto:${profileData?.email}`}>
                {profileData?.email ?? ''}
              </Link>
            </ProfileItem>
          </ProfileSection>

          <ProfileControls
            isEdited={isEdited}
            onEdit={handleEdit}
            onCancel={handleCancel}
          />
        </Grid>
      </Form>
    </Flex>
  );
};

export default Profile;
