import { setupStore } from '../../store';
import { Action, ThunkAction } from '@reduxjs/toolkit';

interface RTKQueryThunk<T> {
  unwrap: () => Promise<T>;
  unsubscribe: () => void;
}

export type RTKQueryInitiateAction<T> = ThunkAction<
  RTKQueryThunk<T>,
  unknown,
  unknown,
  Action
>;

/**
 * Asynchronously dispatches an RTK Query action using the provided Redux store,
 * waits for the query result, and then unsubscribes from the query to clean up resources.
 *
 * This utility handles the retrieval of query data and ensures proper resource cleanup
 * by unsubscribing from the query after execution. The function is generic, allowing
 * you to type the expected return data of the query.
 *
 * @template T - The expected type of the data returned by the query.
 * @param {ReturnType<typeof setupStore>} store - The Redux store used to dispatch the query action.
 * @param {RTKQueryInitiateAction<T>} query - The RTK Query action to initiate.
 * @returns {Promise<T>} A promise that resolves to the data of the query result.
 */
export const baseLoader = async <T>(
  store: ReturnType<typeof setupStore>,
  query: RTKQueryInitiateAction<T>
): Promise<T> => {
  const result = store.dispatch(query);

  let data: T;
  try {
    data = await result.unwrap();
  } finally {
    result.unsubscribe();
  }

  return data;
};
