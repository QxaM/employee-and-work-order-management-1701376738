import { PropsWithChildren } from 'react';
import { AccessibleIcon, Dialog, Flex, IconButton } from '@radix-ui/themes';
import { Cross1Icon } from '@radix-ui/react-icons';

interface ModalPageProps {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  children,
}: PropsWithChildren<ModalPageProps>) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Flex align="center" justify="end" mb="2">
          <Dialog.Close>
            <IconButton variant="ghost" size="2">
              <AccessibleIcon label="close dialog">
                <Cross1Icon width={18} height={18} />
              </AccessibleIcon>
            </IconButton>
          </Dialog.Close>
        </Flex>
        <Flex direction="column" gap="2">
          <Flex direction="column" gap="0">
            <Dialog.Title as="h3" size="3" mx="2" mb="1">
              {title}
            </Dialog.Title>
            <Dialog.Description size="2" mx="2">
              {description}
            </Dialog.Description>
          </Flex>
          {children}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ModalPage;
