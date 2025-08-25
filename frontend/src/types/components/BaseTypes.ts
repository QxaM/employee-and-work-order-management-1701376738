import {
  ComponentType,
  ForwardRefExoticComponent,
  RefAttributes,
  SVGProps,
} from 'react';
import { IconProps as RadixIconProps } from '@radix-ui/themes';

export type IconType =
  | ComponentType<SVGProps<SVGSVGElement>>
  | ForwardRefExoticComponent<RadixIconProps & RefAttributes<SVGSVGElement>>;

export interface IconProps {
  className?: string;
}
