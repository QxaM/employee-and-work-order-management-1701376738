import { useCallback, useState } from 'react';
import { MODAL_TYPE, ModalType, } from '../../../types/components/ModalTypes.tsx';
import { Toast } from 'radix-ui';
import clsx from 'clsx/lite';
import { Button, Flex } from '@radix-ui/themes';
import { Cross2Icon } from '@radix-ui/react-icons';
import MessageWithCauseElement from './MessageWithCauseElement.tsx';

/**
 * An animated modal component to display messages with customizable styles and auto-hide
 * functionality. It is used mainly by DialogManager component, but can be used otherwise too.
 *
 * @param {ModalType} props - Props for the ModalMessage component.
 * @param {string} props.message - The message to display inside the modal.
 * @param {number} props.index - The index of the modal, used for positioning when multiple modals are rendered.
 * @param {number} [props.hideTimeout=10000] - Time in milliseconds before the modal auto-hides. Defaults to 10 seconds.
 * @param {'info' | 'success' | 'error'} [props.type='info'] - The type of the modal, which determines its
 * style (e.g. "info", "warning").
 * @param {function} props.onClose - Callback function triggered when the modal is closed.
 *
 * @example
 * import { MODAL_TYPE } from '@/types/ModalTypes.tsx';
 *
 * const handleModalClose = () => {
 *   console.log('ModalMessage closed');
 * };
 *
 * <ModalMessage
 *   message="This is an informational modal."
 *   index={1}
 *   hideTimeout={5000}
 *   type="info"
 *   onClose={handleModalClose}
 * />
 *
 */
const ModalMessage = ({
  index,
  message,
  type = 'info',
  hideTimeout = 10_000,
  sensitivity = 'foreground',
  onClose,
}: ModalType) => {
  const stackingClasses = {
    0: 'z-[55] translate-y-0 translate-x-0 scale-100 opacity-100',
    1: 'z-[54] -translate-y-4 translate-x-1 scale-[0.98] opacity-95',
    2: 'z-[53] -translate-y-8 translate-x-2 scale-[0.96] opacity-90',
    3: 'z-[52] -translate-y-12 translate-x-3 scale-[0.94] opacity-85',
    4: 'z-[51] -translate-y-16 translate-x-4 scale-[0.92] opacity-80',
  } as const;

  const rootClasses = clsx(
    'm-0 p-(--space-4) rounded-(--radius-3) shadow-(--shadow-2)',
    'w-max min-w-1/7 max-w-1/4',
    MODAL_TYPE[type].border,
    MODAL_TYPE[type].background,
    MODAL_TYPE[type].text,
    'data-[swipe=cancel]:translate-y-0',
    'data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)]',
    'data-[state=closed]:animate-fadeOut data-[state=open]:animate-enterFromBottom',
    'data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]',
    'absolute bottom-4 right-4 transition-all duration-250 ease-in-out',
    stackingClasses[index as keyof typeof stackingClasses]
  );
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onClose();
  }, [onClose]);

  return (
    <Toast.Root
      open={isOpen}
      type={sensitivity}
      onOpenChange={handleClose}
      className={rootClasses}
      duration={hideTimeout}
      data-testid="modal-message"
    >
      <Flex justify="between" align="center" mb="4" className="w-full">
        <div className="size-(--font-size-5)">{MODAL_TYPE[type].icon}</div>
        <Toast.Close asChild>
          <Button variant="ghost" size="3">
            <Cross2Icon className="size-(--font-size-5)" />
          </Button>
        </Toast.Close>
      </Flex>
      <Toast.Description className="text-center">
        {typeof message === 'string' ? (
          message
        ) : (
          <MessageWithCauseElement errorData={message} />
        )}
      </Toast.Description>
    </Toast.Root>
  );
};

ModalMessage.displayName = 'ModalMessage';

export default ModalMessage;
