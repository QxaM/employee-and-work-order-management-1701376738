import { Card, Flex, Text } from '@radix-ui/themes';
import { IconType } from '../../types/components/BaseTypes.ts';
import StatusBadge from './StatusBadge.tsx';
import { Service } from '../../types/components/ServiceStatusTypes.ts';

interface ServiceStatusCardProps {
  name: string;
  service: Service;
  icon?: IconType;
}

const ServiceStatusCard = ({
  name,
  service,
  icon: Icon,
}: ServiceStatusCardProps) => {
  return (
    <Card variant="surface" className="w-full">
      <Flex justify="between" align="center">
        <Flex justify="start" align="center" gap="2">
          {Icon && (
            <div className="text-(--gray-a8)">
              <Icon className="size-(--font-size-7)" />
            </div>
          )}
          <Text as="p" className="first-letter:uppercase">
            {name}
          </Text>
        </Flex>
        <StatusBadge service={service} />
      </Flex>
    </Card>
  );
};

export default ServiceStatusCard;
