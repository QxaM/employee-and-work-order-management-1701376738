import { Container, Em, Flex, Heading, Section, Text } from '@radix-ui/themes';
import LinkButton from '../components/shared/LinkButton.tsx';
import ServicesStatusCard from '../components/serviceStatus/ServicesStatusCard.tsx';
import DemoCallout from '../components/DemoCallout.tsx';

const HomePage = () => {
  return (
    <Container align="center" height="100%" width="40%">
      <Section height="100%">
        <Flex
          direction="column"
          align="center"
          justify="center"
          height="100%"
          gap="9"
          className="text-center"
        >
          <Flex direction="column" gap="4" align="center" justify="center">
            <Heading as="h2" size="9">
              Transform Your{' '}
              <Em className="!text-(--accent-9)">Project Management</Em>
            </Heading>
            <Text as="p" size="5">
              MaxQ Work Manager is a powerful tool designed to streamline your
              project management process. From planning to execution -
              we&apos;ve got you covered.
            </Text>
            <LinkButton to="/register" size="4">
              Get Started
            </LinkButton>
          </Flex>
          <DemoCallout />
          <ServicesStatusCard />
        </Flex>
      </Section>
    </Container>
  );
};

export default HomePage;
