export interface Pageable {
  isFirst: boolean;
  isLast: boolean;
  currentPage: number;
  totalPages: number;
  currentElements: number;
  totalElements: number;
  pageSize: number;
}
