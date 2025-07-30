import { createPortal } from 'react-dom';
import { PropsWithChildren } from 'react';

interface ModalPageProps {
  onClose: () => void;
}

/**
 * ModalPage component.
 *
 * A component that renders a modal dialog using React portal. The modal includes a backdrop
 * and a close button. It supports customizable content through child elements.
 *
 * @param {Object} props - The properties object.
 * @param {function} props.onClose - Callback function invoked when the modal or backdrop is clicked to close the modal.
 * @param {React.ReactNode} props.children - The content to be displayed within the modal dialog.
 *
 */
const ModalPage = ({
  onClose,
  children,
}: PropsWithChildren<ModalPageProps>) => {
  return createPortal(
    <div className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center z-0">
      <div
        id="backdrop"
        aria-hidden
        className="absolute inset-0 w-full h-screen bg-qxam-neutral-dark opacity-75 z-40"
        onClick={onClose}
      />
      <dialog
        className="relative z-50 p-2 lg:w-1/3 w-2/3 shadow-xl bg-qxam-primary-extreme-light"
        open
      >
        <div className="flex items-center justify-end">
          <button
            aria-label="close dialog"
            onClick={onClose}
            className="border-2 border-transparent rounded-md p-1 hover:border-2 hover:border-qxam-accent-lightest hover:shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {children}
      </dialog>
    </div>,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.getElementById('modal')!
  );
};

export default ModalPage;
