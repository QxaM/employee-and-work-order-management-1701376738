import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { isQueryError } from '../../utils/errorUtils.ts';

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
    <div className="flex justify-center w-full text-qxam-error-extreme-dark">
      <section className="flex flex-col m-2 px-4 py-8 rounded h-fit w-full gap-4 justify-self-center bg-qxam-error-extreme-light">
        <header className="flex flex-row items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-8"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clipRule="evenodd"
            />
          </svg>
          <h4 className="text-2xl font-bold">Something went wrong!</h4>
        </header>

        <article className="flex flex-col gap-8">
          <p>
            Something went wrong during your request. See details below or try
            again later.
          </p>

          <section
            aria-labelledby="error-status"
            className="flex flex-col gap-2"
          >
            <h5 id="error-status" className="text-xl font-medium">
              Error {errorStatus}
            </h5>
            <p>{errorDescription}</p>
          </section>
        </article>
      </section>
    </div>
  );
};

export default ErrorElement;
