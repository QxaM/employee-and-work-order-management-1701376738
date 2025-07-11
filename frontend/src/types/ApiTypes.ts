/**
 * Represents the structure of an API error response.
 */
export interface ApiErrorType {
  message: string;
}

export interface Pageable {
  number: number;
  size: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
