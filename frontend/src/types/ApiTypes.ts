import { CustomFetchBaseQueryError } from '../store/api/base.ts';
import { SerializedError } from '@reduxjs/toolkit';

/**
 * Represents the structure of an API error response.
 */
export interface ApiErrorType {
  message: string;
}

export type QueryError =
  | CustomFetchBaseQueryError
  | SerializedError
  | undefined;

/**
 * Represents a pageable resource containing information about the current
 * page, its size, and pagination details for navigating through a dataset.
 *
 * Properties:
 * - `number`: The current page number (zero-based index).
 * - `size`: The number of elements to be displayed per page.
 * - `numberOfElements`: The actual number of elements returned in the current page.
 * - `totalElements`: The total number of elements across all pages.
 * - `totalPages`: The total number of available pages.
 * - `first`: A boolean indicating if the current page is the first page.
 * - `last`: A boolean indicating if the current page is the last page.
 */
export interface Pageable {
  number: number;
  size: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
