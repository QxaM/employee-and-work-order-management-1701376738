import { Color } from './TailwindTypes.ts';

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

export interface ElementColor {
  text: string;
  navButton: string;
  pageButton: string;
  activePageButton: string;
}

export const PageableColor: Record<Color, ElementColor> = {
  violet: {
    text: 'text-(--accent-a11)',
    navButton: 'border-(--accent-3) hover:bg-(--accent-3)',
    pageButton: 'hover:bg-(--accent-4)',
    activePageButton: 'bg-(--accent-a11) text-(--accent-3) shadow-(--accent-3)',
  },
  gray: {
    text: 'text-(--gray-a11)',
    navButton: 'border-(--gray-3) hover:bg-(--gray-3)',
    pageButton: 'hover:bg-(--gray-4)',
    activePageButton: 'bg-(--gray-a11) text-(--gray-3) shadow-(--gray-3)',
  },
} as const;
