import { useEurekaHealthcheckQuery } from '../../store/api/eureka.ts';
import { useGatewayHealthcheckQuery } from '../../store/api/gateway.ts';
import { useAuthHealthcheckQuery } from '../../store/api/auth.ts';
import { BadgeProps } from '@radix-ui/themes';
import { IconType } from './BaseTypes.ts';
import {
  CheckCircledIcon,
  ClockIcon,
  CrossCircledIcon,
} from '@radix-ui/react-icons';
import DoorOpenIcon from '../../components/icons/DoorOpenIcon.tsx';
import LightbulbIcon from '../../components/icons/LightbulbIcon.tsx';
import ShieldIcon from '../../components/icons/ShieldIcon.tsx';

interface ApplicationServiceType {
  name: string;
  icon: IconType;
}

export const APP_SERVICES: ApplicationServiceType[] = [
  {
    name: 'gateway',
    icon: DoorOpenIcon,
  },
  {
    name: 'eureka',
    icon: LightbulbIcon,
  },
  {
    name: 'auth',
    icon: ShieldIcon,
  },
] as const;
export type Service = (typeof APP_SERVICES)[number]['name'];

export const HEALTH_CHECK_MAP: Record<
  Service,
  typeof useGatewayHealthcheckQuery
> = {
  gateway: useGatewayHealthcheckQuery,
  eureka: useEurekaHealthcheckQuery,
  auth: useAuthHealthcheckQuery,
};

interface BadgeStatusType {
  color: BadgeProps['color'];
  icon: IconType;
  text: 'online' | 'starting' | 'offline';
}

export const getBadgeStatus = (
  isSuccess: boolean,
  isPending: boolean
): BadgeStatusType => {
  if (isSuccess) {
    return {
      color: 'green',
      icon: CheckCircledIcon,
      text: 'online',
    };
  }
  if (isPending) {
    return {
      color: 'yellow',
      icon: ClockIcon,
      text: 'starting',
    };
  }
  return {
    color: 'red',
    icon: CrossCircledIcon,
    text: 'offline',
  };
};
