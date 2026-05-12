import type {
  ComponentType,
  ForwardRefExoticComponent,
  RefAttributes,
  SVGProps,
} from 'react';
import type { IconProps as RadixIconProps } from '@radix-ui/themes';

export type IconType =
  | ComponentType<SVGProps<SVGSVGElement>>
  | ForwardRefExoticComponent<RadixIconProps & RefAttributes<SVGSVGElement>>;

export interface IconProps {
  className?: string;
}
