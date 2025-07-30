import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { MODAL_TYPE, ModalType } from '../../types/ModalTypes.tsx';

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
  message,
  index,
  hideTimeout = 10_000,
  type = 'info',
  onClose,
}: ModalType) => {
  const MODAL_Y_TRANSLATION = -50;
  const MAX_INDEX = 4;
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    setIsOpen(true);

    const timeout = setTimeout(() => {
      handleClose();
    }, hideTimeout);

    return () => {
      clearTimeout(timeout);
    };
  }, [handleClose, hideTimeout]);

  return createPortal(
    <div className="fixed w-1/6 bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.dialog
            ref={dialogRef}
            className={`relative m-0 p-4 rounded-lg shadow-lg border w-full ${MODAL_TYPE[type].border} ${MODAL_TYPE[type].background} ${MODAL_TYPE[type].text}`}
            initial={{ y: 200 }}
            animate={{ y: MODAL_Y_TRANSLATION * (MAX_INDEX - index) }}
            exit={{ y: 200 }}
            transition={{ duration: 1, type: 'spring' }}
            open
            onClose={() => {
              setIsOpen(false);
            }}
          >
            <header className="flex justify-between items-center text-center">
              <div>{MODAL_TYPE[type].icon}</div>
              <button
                className="hover:shadow-lg px-2 py-1 rounded"
                onClick={handleClose}
              >
                ✕
              </button>
            </header>
            <p className="text-center">{message}</p>
          </motion.dialog>
        )}
      </AnimatePresence>
    </div>,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.getElementById('modal')!
  );
};

ModalMessage.displayName = 'ModalMessage';

export default ModalMessage;
