import { QueryError } from '../../types/api/BaseTypes.ts';
import { readErrorMessage } from '../../utils/errorUtils.ts';
import { NonUndefined } from '../../types/BaseTypes.ts';
import { Callout } from '@radix-ui/themes';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface ErrorComponentProps {
  error: string | NonUndefined<QueryError>;
}

/**
 * Renders an error message styled with a red background
 * and an error icon.
 *
 * @param {Object} props - Component props.
 * @param {string} props.error - The error data to display.
 *
 * @example
 * <ErrorComponent message="Something went wrong. Please try again." />
 *
 */
const ErrorComponent = ({ error }: ErrorComponentProps) => {
  const message = readErrorMessage(error);

  return (
    <Callout.Root color="red" role="alert" size="1" variant="surface">
      <Callout.Icon>
        <ExclamationTriangleIcon />
      </Callout.Icon>
      <Callout.Text>{message}</Callout.Text>
    </Callout.Root>
  );
};

export default ErrorComponent;
