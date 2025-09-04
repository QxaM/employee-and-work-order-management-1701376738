import {
  Badge,
  Box,
  Flex,
  Grid,
  Heading,
  Link,
  Separator,
  Skeleton,
} from '@radix-ui/themes';
import {
  useMyProfileQuery,
  useUpdateMyProfileMutation,
} from '../../store/api/profile.ts';
import ProfileSection from './ProfileSection.tsx';
import ProfileItem from './ProfileItem.tsx';
import { FormEvent, useState } from 'react';
import Form from '../shared/form/Form.tsx';
import ProfileControls from './ProfileControls.tsx';
import { UpdateProfileType } from '../../types/api/ProfileTypes.ts';
import { useMeData } from '../../hooks/useMeData.tsx';
import { getColor } from '../../types/components/RoleTypes.ts';
import { EnvelopeClosedIcon, PersonIcon } from '@radix-ui/react-icons';
import PersonGearOutlineIcon from '../icons/PersonGearOutlineIcon.tsx';
import ProfileAvatar from './ProfileAvatar.tsx';

const Profile = () => {
  const { data: profileData } = useMyProfileQuery();
  const { me } = useMeData();

  const [isEdited, setIsEdited] = useState(false);
  const [updateProfile] = useUpdateMyProfileMutation();

  const handleEdit = () => {
    setIsEdited(true);
  };
  const handleCancel = () => {
    setIsEdited(false);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd.entries());

    const profile: UpdateProfileType = {
      firstName: data['first name'] as string,
      middleName: data['middle name'] as string,
      lastName: data['last name'] as string,
    };
    void updateProfile(profile);
    setIsEdited(false);
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
      <ProfileAvatar
        firstName={profileData?.firstName}
        lastName={profileData?.lastName}
        isEdited={isEdited}
      />

      <Form handleSubmit={handleSubmit} className="w-full">
        <Grid
          columns={{ initial: '1', sm: '2' }}
          width="100%"
          mt="8"
          gap="4"
          align="start"
        >
          <ProfileSection title="Personal Information" icon={PersonIcon}>
            <Grid columns="2" gap="4" minHeight="0">
              <ProfileItem
                isEdited={isEdited}
                isLoading={!profileData}
                title="first name"
                required
              >
                {profileData?.firstName ?? ''}
              </ProfileItem>
              <ProfileItem
                isEdited={isEdited}
                isLoading={!profileData}
                title="middle name"
              >
                {profileData?.middleName ?? ''}
              </ProfileItem>
              <Box gridColumnStart="1" gridColumnEnd="3">
                <ProfileItem
                  isEdited={isEdited}
                  isLoading={!profileData}
                  title="last name"
                  required
                >
                  {profileData?.lastName ?? ''}
                </ProfileItem>
              </Box>
            </Grid>
          </ProfileSection>
          <ProfileSection title="email address" icon={EnvelopeClosedIcon}>
            <ProfileItem isEdited={false} isLoading={!profileData}>
              <Link href={`mailto:${profileData?.email}`}>
                {profileData?.email ?? ''}
              </Link>
            </ProfileItem>
          </ProfileSection>
          <Box gridColumnStart="1" gridColumnEnd="3">
            <ProfileSection title="Assigned Roles" icon={PersonGearOutlineIcon}>
              <Skeleton loading={!me}>
                <Flex direction="row" justify="start" align="center" gap="2">
                  {me?.roles
                    .toSorted((a, b) => b.id - a.id)
                    .map((role) => (
                      <Badge key={role.name} size="3" color={getColor(role)}>
                        {role.name}
                      </Badge>
                    ))}
                </Flex>
              </Skeleton>
            </ProfileSection>
          </Box>

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
