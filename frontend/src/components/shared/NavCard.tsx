import { Avatar, AvatarProps, Box, Card, Flex, Text } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { CaretRightIcon } from '@radix-ui/react-icons';
import { ReactElement, SVGProps } from 'react';
import clsx from 'clsx/lite';
import { NonUndefined } from '../../types/BaseTypes.ts';

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

interface NavCardProps {
  to: string;
  title: string;
  description: string;
  icon?: ReactElement<SVGProps<SVGSVGElement>>;
  color?: AvatarProps['color'];
}

const NavCard = ({
  to,
  title,
  description,
  color = 'violet',
  icon,
}: NavCardProps) => {
  const iconWrapperStyles = clsx(`size-(--space-7)`, cardColors[color]);
  const fallback = title.charAt(0).toUpperCase();
  return (
    <Card asChild>
      <Link to={to}>
        <Flex gap="3" align="center">
          {!icon && (
            <Avatar size="3" fallback={fallback} color={color}></Avatar>
          )}
          {icon && (
            <Flex justify="center" align="center" className={iconWrapperStyles}>
              <Box className="size-(--font-size-5)">{icon}</Box>
            </Flex>
          )}
          <Box>
            <Text as="div" size="2" weight="bold">
              {title}
            </Text>
            <Text as="div" size="2" color="gray">
              {description}
            </Text>
          </Box>
        </Flex>
        <Flex justify="end" align="center">
          <CaretRightIcon width={24} height={24} />
        </Flex>
      </Link>
    </Card>
  );
};

export default NavCard;
