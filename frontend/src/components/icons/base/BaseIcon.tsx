import { IconProps } from '../../../types/components/BaseTypes.ts';
import clsx from 'clsx';
import { cloneElement, ReactElement } from 'react';

interface BaseIconProps extends IconProps {
  children: ReactElement<IconProps>;
}

const BaseIcon = ({ className, children }: BaseIconProps) => {
  const classes = clsx(className ?? 'size-(--font-size-8)');


  return cloneElement(children, {
    className: classes,
  });
};

export default BaseIcon;
