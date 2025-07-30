/**
 * Represents pagination information for a collection or dataset.
 * This interface is used to describe details about the current page,
 * total pages, and the number of elements in a paginated context.
 *
 * Properties:
 * - `isFirst`: Indicates whether the current page is the first page.
 * - `isLast`: Indicates whether the current page is the last page.
 * - `currentPage`: The zero-based index of the currently accessed page.
 * - `totalPages`: The total number of pages available.
 * - `currentElements`: The number of elements on the currently accessed page.
 * - `totalElements`: The total number of elements in the entire dataset.
 * - `pageSize`: The number of elements per page.
 */
export interface Pageable {
  isFirst: boolean;
  isLast: boolean;
  currentPage: number;
  totalPages: number;
  currentElements: number;
  totalElements: number;
  pageSize: number;
}
