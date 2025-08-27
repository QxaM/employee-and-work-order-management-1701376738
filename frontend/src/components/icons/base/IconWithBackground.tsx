import { AvatarProps, Flex } from '@radix-ui/themes';
import { IconType } from '../../../types/components/BaseTypes.ts';
import clsx from 'clsx';
import { NonUndefined } from '../../../types/BaseTypes.ts';

const cardColors: Record<NonUndefined<AvatarProps['color']>, string> = {
  ruby: 'bg-(--ruby-a3) text-(--ruby-a11)',
  gray: 'bg-(--gray-a3) text-(--gray-a11)',
  gold: 'bg-(--gold-a3) text-(--gold-a11)',
  bronze: 'bg-(--bronze-a3) text-(--bronze-a11)',
  brown: 'bg-(--brown-a3) text-(--brown-a11)',
  yellow: 'bg-(--yellow-a3) text-(--yellow-a11)',
  amber: 'bg-(--amber-a3) text-(--amber-a11)',
  orange: 'bg-(--orange-a3) text-(--orange-a11)',
  tomato: 'bg-(--tomato-a3) text-(--tomato-a11)',
  red: 'bg-(--red-a3) text-(--red-a11)',
  crimson: 'bg-(--crimson-a3) text-(--crimson-a11)',
  pink: 'bg-(--pink-a3) text-(--pink-a11)',
  plum: 'bg-(--plum-a3) text-(--plum-a11)',
  purple: 'bg-(--purple-a3) text-(--purple-a11)',
  violet: 'bg-(--violet-a3) text-(--violet-a11)',
  iris: 'bg-(--iris-a3) text-(--iris-a11)',
  indigo: 'bg-(--indigo-a3) text-(--indigo-a11)',
  blue: 'bg-(--blue-a3) text-(--blue-a11)',
  cyan: 'bg-(--cyan-a3) text-(--cyan-a11)',
  teal: 'bg-(--teal-a3) text-(--teal-a11)',
  jade: 'bg-(--jade-a3) text-(--jade-a11)',
  green: 'bg-(--green-a3) text-(--green-a11)',
  grass: 'bg-(--grass-a3) text-(--grass-a11)',
  lime: 'bg-(--lime-a3) text-(--lime-a11)',
  mint: 'bg-(--mint-a3) text-(--mint-a11)',
  sky: 'bg-(--sky-a3) text-(--sky-a11)',
} as const;

interface IconWithBackgroundProps {
  icon: IconType;
  className?: string;
  color?: AvatarProps['color'];
}

const IconWithBackground = ({
  icon: Icon,
  className,
  color = 'violet',
}: IconWithBackgroundProps) => {
  const iconWrapperStyles = clsx(className, cardColors[color]);

  return (
    <Flex justify="center" align="center" className={iconWrapperStyles}>
      <Icon />
    </Flex>
  );
};

export default IconWithBackground;
