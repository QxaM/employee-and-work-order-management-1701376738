import type { PropsWithChildren } from 'react';
import {
  AccessibleIcon,
  Dialog,
  Flex,
  IconButton,
  Inset,
} from '@radix-ui/themes';
import { Cross1Icon } from '@radix-ui/react-icons';
import type { Color } from '../types/TailwindTypes.ts';
import clsx from 'clsx';
import BaseIcon from '../components/icons/base/BaseIcon.tsx';
import type { IconType } from '../types/components/BaseTypes.ts';

const ModalBackgroundColorMap: Record<Color, string> = {
  violet: `bg-(--violet-a11)`,
  gray: `bg-(--gray-a11)`,
  gold: `bg-(--gold-a11)`,
  amber: `bg-(--amber-a11)`,
  blue: `bg-(--blue-a11)`,
  bronze: `bg-(--bronze-a11)`,
  green: `bg-(--green-a11)`,
  crimson: `bg-(--crimson-a11)`,
  brown: `bg-(--brown-a11)`,
  yellow: `bg-(--yellow-a11)`,
  orange: `bg-(--orange-a11)`,
  tomato: `bg-(--tomato-a11)`,
  red: `bg-(--red-a11)`,
  ruby: `bg-(--ruby-a11)`,
  pink: `bg-(--pink-a11)`,
  plum: `bg-(--plum-a11)`,
  purple: `bg-(--purple-a11)`,
  iris: `bg-(--iris-a11)`,
  indigo: `bg-(--indigo-a11)`,
  cyan: `bg-(--cyan-a11)`,
  teal: `bg-(--teal-a11)`,
  jade: `bg-(--jade-a11)`,
  grass: `bg-(--grass-a11)`,
  lime: `bg-(--lime-a11)`,
  mint: `bg-(--mint-a11)`,
  sky: `bg-(--sky-a11)`,
};

interface ModalPageProps {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  color?: Color;
  icon?: IconType;
}

/**
 * ModalPage component.
 *
 * A component that renders a modal dialog using React portal. The modal includes a backdrop
 * and a close button. It supports customizable content through child elements.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The content to be displayed within the modal dialog.
 *
 */
const ModalPage = ({
  title,
  description,
  open,
  onOpenChange,
  color,
  icon: Icon,
  children,
}: PropsWithChildren<ModalPageProps>) => {
  const modalClasses = clsx(
    color && `${ModalBackgroundColorMap[color]} text-(--accent-contrast)`
  );
  const closeClasses = clsx(color && 'text-(--accent-contrast)!');

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Flex direction="column" gap="2">
          <Inset side="top" clip="padding-box">
            <Flex
              direction="row"
              justify="between"
              align="start"
              gap="0"
              className={modalClasses}
              px="6"
              pt="6"
              pb="5"
            >
              <Flex direction="row" gap="3">
                {Icon && (
                  <BaseIcon>
                    <Icon />
                  </BaseIcon>
                )}
                <Flex direction="column" gap="0">
                  <Dialog.Title as="h3" size="4" mb="1" className="text-white">
                    {title}
                  </Dialog.Title>
                  <Dialog.Description size="2">
                    {description}
                  </Dialog.Description>
                </Flex>
              </Flex>
              <Flex align="center" justify="start">
                <Dialog.Close>
                  <IconButton
                    variant="soft"
                    size="2"
                    color="gray"
                    className={closeClasses}
                  >
                    <AccessibleIcon label="close dialog">
                      <Cross1Icon width={18} height={18} />
                    </AccessibleIcon>
                  </IconButton>
                </Dialog.Close>
              </Flex>
            </Flex>
          </Inset>
          {children}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ModalPage;
