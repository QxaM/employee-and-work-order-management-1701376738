import { Flex } from '@radix-ui/themes';
import ErrorComponent from '../../ErrorComponent.tsx';
import { QueryError } from '../../../../types/api/BaseTypes.ts';
import { readErrorMessage } from '../../../../utils/errorUtils.ts';
import { PropsWithChildren } from 'react';

interface FormContentProps {
  isServerError?: boolean;
  serverError?: Error | QueryError | string;
}

const FormContent = ({
  isServerError,
  serverError,
  children,
}: PropsWithChildren<FormContentProps>) => {
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      width="100%"
      gap="2"
    >
      {isServerError && (
        <Flex justify="center" align="center" width="100%">
          <ErrorComponent error={readErrorMessage(serverError)} />
        </Flex>
      )}
      {children}
    </Flex>
  );
};

export default FormContent;
