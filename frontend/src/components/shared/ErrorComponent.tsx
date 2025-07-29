import { QueryError } from '../../types/ApiTypes.ts';
import { readErrorMessage } from '../../utils/errorUtils.ts';
import { NonUndefined } from '../../types/SharedTypes.ts';

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
    <p className="px-2 py-1 flex items-center gap-1 bg-qxam-error-extreme-light text-qxam-error-darker rounded border border-qxam-error-lightest">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          clipRule="evenodd"
        />
      </svg>

      {message}
    </p>
  );
};

export default ErrorComponent;
