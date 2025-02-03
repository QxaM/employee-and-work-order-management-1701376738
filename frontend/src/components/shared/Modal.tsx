import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { ModalType } from '@/types/ModalTypes.ts';

export const MODAL_TYPE = {
  info: {
    background: 'bg-qxam-accent-extreme-light',
    text: 'text-qxam-accent-neutral-dark',
    border: 'border-qxam-accent-lighter',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  success: {
    background: 'bg-qxam-success-extreme-light',
    text: 'text-qxam-success-darkest',
    border: 'border-qxam-success-lighter',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  error: {
    background: 'bg-qxam-error-extreme-light',
    text: 'text-qxam-error-darkest',
    border: 'border-qxam-error-lighter',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5"
      >
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

const Modal = ({
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

Modal.displayName = 'Modal';

export default Modal;
