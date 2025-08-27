import { Separator } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';

const FormFooter = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Separator
        size="4"
        mt="6"
        mb="5"
        className="!w-5/6"
        data-testid="separator"
      />
      {children}
    </>
  );
};

export default FormFooter;
