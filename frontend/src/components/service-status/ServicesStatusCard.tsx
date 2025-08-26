import { Card, Flex, Heading, Text } from '@radix-ui/themes';
import { APP_SERVICES } from '../../types/components/ServiceStatusTypes.ts';
import ServiceStatusCard from './ServiceStatusCard.tsx';

const ServicesStatusCard = () => {
  return (
    <Flex
      direction="column"
      gap="2"
      align="center"
      justify="center"
      width="100%"
    >
      <Heading as="h3" size="7">
        System Status
      </Heading>
      <Text as="p" size="4">
        Real-time status of our microservice infrastructure.
      </Text>
      <Card variant="classic" size="3" className="w-full">
        <Flex
          direction="column"
          align="center"
          justify="center"
          flexGrow="1"
          gap="2"
        >
          {APP_SERVICES.map((service) => (
            <ServiceStatusCard
              key={service.name}
              name={`${service.name} service`}
              service={service.name}
              icon={service.icon}
            />
          ))}
        </Flex>
      </Card>
    </Flex>
  );
};

export default ServicesStatusCard;
