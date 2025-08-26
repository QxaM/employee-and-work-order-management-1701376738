import { Avatar, AvatarProps, Box, Card, Flex, Text } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { CaretRightIcon } from '@radix-ui/react-icons';
import { IconType } from '../../types/components/BaseTypes.ts';
import IconWithBackground from '../icons/base/IconWithBackground.tsx';

interface NavCardProps {
  to: string;
  title: string;
  description: string;
  icon?: IconType;
  color?: AvatarProps['color'];
}

const NavCard = ({
  to,
  title,
  description,
  color = 'violet',
  icon: Icon,
}: NavCardProps) => {
  const fallback = title.charAt(0).toUpperCase();

  return (
    <Card asChild>
      <Link to={to}>
        <Flex gap="3" align="center">
          {!Icon && (
            <Avatar size="3" fallback={fallback} color={color}></Avatar>
          )}
          {Icon && (
            <IconWithBackground icon={Icon} className="size-(--space-7)" />
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
