import { Card, Container, Flex, Section } from '@radix-ui/themes';
import Profile from '../components/Profile.tsx';

const ProfilePage = () => {
  return (
    <Container align="center" height="100%">
      <Section height="100%">
        <Flex align="center" justify="center" height="100%">
          <Card variant="classic" className="w-full">
            <Profile />
          </Card>
        </Flex>
      </Section>
    </Container>
  );
};

export default ProfilePage;
