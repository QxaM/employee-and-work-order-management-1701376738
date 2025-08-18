import { Toast } from 'radix-ui';
import { PropsWithChildren } from 'react';
import clsx from 'clsx/lite';

const ModalProvider = ({ children }: PropsWithChildren) => {
  const viewportClasses = clsx(
    'fixed bottom-8 right-4 z-[2147483647] m-0 w-1/7 max-w-[100vw]',
    'list-none p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]'
  );
  return (
    <Toast.Provider duration={10_000} swipeDirection="down">
      {children}
      <Toast.Viewport className={viewportClasses} />
    </Toast.Provider>
  );
};

export default ModalProvider;
