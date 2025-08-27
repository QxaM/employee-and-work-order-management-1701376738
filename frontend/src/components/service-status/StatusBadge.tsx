import { Badge, Text } from '@radix-ui/themes';
import { useMemo } from 'react';
import {
  getBadgeStatus,
  HEALTH_CHECK_MAP,
  Service,
} from '../../types/components/ServiceStatusTypes.ts';

interface StatusBadgeProps {
  service: Service;
}

const StatusBadge = ({ service }: StatusBadgeProps) => {
  const { isSuccess, isLoading } = HEALTH_CHECK_MAP[service](undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    pollingInterval: 45_000,
  });

  const badgeStatus = useMemo(
    () => getBadgeStatus(isSuccess, isLoading),
    [isSuccess, isLoading]
  );

  return (
    <Badge size="3" variant="soft" color={badgeStatus.color}>
      <badgeStatus.icon data-testid="status-badge-icon" />
      <Text as="p" className="first-letter:uppercase">
        {badgeStatus.text}
      </Text>
    </Badge>
  );
};

export default StatusBadge;
