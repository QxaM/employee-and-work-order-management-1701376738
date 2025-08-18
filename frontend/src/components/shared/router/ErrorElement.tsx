import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { isQueryError } from '../../../utils/errorUtils.ts';
import { Container, Flex, Heading, Section, Text } from '@radix-ui/themes';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

/**
 * A functional React component that renders a user-friendly error message based on the current routing or query error state.
 *
 * The `ErrorElement` component utilizes the `useRouteError` hook to retrieve routing-related error information and determines
 * the appropriate error status and description to display to the user. If the error is an instance of a general `Error` or
 * a query-related error, it extracts and displays the relevant details accordingly.
 */
const ErrorElement = () => {
  const error = useRouteError();

  let errorStatus = 'Unknown';
  let errorDescription = 'Unknown error occurred.';

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status.toString();
    errorDescription = error.statusText;
  }

  if (error instanceof Error) {
    if (error.name !== 'Error') {
      errorStatus = error.name;
    }
    errorDescription = error.message;
  }

  if (isQueryError(error)) {
    if ('status' in error) {
      errorStatus = error.status.toString();
    }
    if ('code' in error && error.code) {
      errorStatus = error.code;
    }
    if (error.message) {
      errorDescription = error.message;
    }
  }

  return (
    <Container className="text-(--red-a12)">
      <Section px="6" className="bg-(--red-a3)">
        <Heading as="h4" size="6" weight="bold">
          <Flex gap="4" align="center" mb="2">
            <ExclamationTriangleIcon className="size-(--font-size-6)" />
            <Text>Something went wrong!</Text>
          </Flex>
          <Text as="p" size="3" weight="regular">
            Something went wrong during your request. See details below or try
            again later.
          </Text>
        </Heading>

        <Section pt="8" pb="0">
          <Flex direction="column" gap="1" align="start">
            <Heading as="h5" size="5" weight="medium" id="error-status">
              Error {errorStatus}
            </Heading>
            <Text as="p" size="3" weight="regular">
              {errorDescription}
            </Text>
          </Flex>
        </Section>
      </Section>
    </Container>
  );
};

export default ErrorElement;
