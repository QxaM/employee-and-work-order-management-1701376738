import {
  ComponentType,
  ForwardRefExoticComponent,
  RefAttributes,
  SVGProps,
} from 'react';
import { IconProps } from '@radix-ui/themes';

export type IconType =
  | ComponentType<SVGProps<SVGSVGElement>>
  | ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
