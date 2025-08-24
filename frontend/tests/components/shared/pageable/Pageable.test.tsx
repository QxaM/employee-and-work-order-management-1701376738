import { render, screen } from '@testing-library/react';

import Pageable from '../../../../src/components/shared/pageable/Pageable.tsx';
import { Pageable as PageableData } from '../../../../src/types/components/PageableTypes.ts';
import { BrowserRouter } from 'react-router-dom';
import { describe } from 'vitest';

describe('Pageable', () => {
  describe('Page navigation buttons', () => {
    const previousLabel = 'previous page';
    const nextLabel = 'next page';
    const disabledClass = 'pointer-events-none';

    it('Should contain previous and next page buttons', () => {
      // Given
      const pageable: PageableData = {
        isFirst: false,
        isLast: false,
        currentElements: 1,
        currentPage: 0,
        pageSize: 15,
        totalElements: 1,
        totalPages: 1,
      };

      render(
        <BrowserRouter>
          <Pageable pageable={pageable} />
        </BrowserRouter>
      );

      // When
      const previousButton = screen.getByLabelText(previousLabel);
      const nextButton = screen.getByLabelText(nextLabel);

      // Then
      expect(previousButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it('Should disable previous button when first page', () => {
      // Given
      const pageable: PageableData = {
        isFirst: true,
        isLast: false,
        currentElements: 1,
        currentPage: 0,
        pageSize: 15,
        totalElements: 1,
        totalPages: 1,
      };

      render(
        <BrowserRouter>
          <Pageable pageable={pageable} />
        </BrowserRouter>
      );

      // When
      const previousButton = screen.getByLabelText(previousLabel);
      const nextButton = screen.getByLabelText(nextLabel);

      // Then
      expect(previousButton).toHaveClass(disabledClass);
      expect(nextButton).not.toHaveClass(disabledClass);
    });

    it('Should disable next button when last page', () => {
      // Given
      const pageable: PageableData = {
        isFirst: false,
        isLast: true,
        currentElements: 1,
        currentPage: 0,
        pageSize: 15,
        totalElements: 1,
        totalPages: 1,
      };

      render(
        <BrowserRouter>
          <Pageable pageable={pageable} />
        </BrowserRouter>
      );

      // When
      const previousButton = screen.getByLabelText(previousLabel);
      const nextButton = screen.getByLabelText(nextLabel);

      // Then
      expect(previousButton).not.toHaveClass(disabledClass);
      expect(nextButton).toHaveClass(disabledClass);
    });
  });

  describe('Page buttons', () => {
    it('Should contain any page button', () => {
      // Given
      const pageable: PageableData = {
        isFirst: false,
        isLast: false,
        currentElements: 1,
        currentPage: 0,
        pageSize: 15,
        totalElements: 1,
        totalPages: 1,
      };

      render(
        <BrowserRouter>
          <Pageable pageable={pageable} />
        </BrowserRouter>
      );

      // When
      const pageButton = screen.getByLabelText(/page \d/);

      // Then
      expect(pageButton).toBeInTheDocument();
    });

    it('Should render odd button counts', () => {
      // Given
      const pageable: PageableData = {
        isFirst: false,
        isLast: false,
        currentElements: 15,
        currentPage: 2,
        pageSize: 15,
        totalElements: 15 * 5,
        totalPages: 5,
      };

      render(
        <BrowserRouter>
          <Pageable pageable={pageable} maxPages={5} />
        </BrowserRouter>
      );

      // When
      const pageButton1 = screen.getByLabelText(/page 1/);
      const pageButton2 = screen.getByLabelText(/page 2/);
      const pageButton3 = screen.getByLabelText(/page 3/);
      const pageButton4 = screen.getByLabelText(/page 4/);
      const pageButton5 = screen.getByLabelText(/page 5/);

      // Then
      expect(pageButton1).toBeInTheDocument();
      expect(pageButton2).toBeInTheDocument();
      expect(pageButton3).toBeInTheDocument();
      expect(pageButton4).toBeInTheDocument();
      expect(pageButton5).toBeInTheDocument();
    });

    it('Should render even button counts', () => {
      // Given
      const pageable: PageableData = {
        isFirst: false,
        isLast: false,
        currentElements: 15,
        currentPage: 2,
        pageSize: 15,
        totalElements: 15 * 6,
        totalPages: 6,
      };

      render(
        <BrowserRouter>
          <Pageable pageable={pageable} maxPages={6} />
        </BrowserRouter>
      );

      // When
      const pageButton1 = screen.getByLabelText(/page 1/);
      const pageButton2 = screen.getByLabelText(/page 2/);
      const pageButton3 = screen.getByLabelText(/page 3/);
      const pageButton4 = screen.getByLabelText(/page 4/);
      const pageButton5 = screen.getByLabelText(/page 5/);
      const pageButton6 = screen.getByLabelText(/page 6/);

      // Then
      expect(pageButton1).toBeInTheDocument();
      expect(pageButton2).toBeInTheDocument();
      expect(pageButton3).toBeInTheDocument();
      expect(pageButton4).toBeInTheDocument();
      expect(pageButton5).toBeInTheDocument();
      expect(pageButton6).toBeInTheDocument();
    });

    it('Should contain at most 2 previous pages', () => {
      // Given
      const pageable: PageableData = {
        isFirst: false,
        isLast: false,
        currentElements: 15,
        currentPage: 3,
        pageSize: 15,
        totalElements: 15 * 6,
        totalPages: 6,
      };

      render(
        <BrowserRouter>
          <Pageable pageable={pageable} maxPages={5} />
        </BrowserRouter>
      );

      // When
      const pageButton1 = screen.queryByLabelText(/page 1/);
      const pageButton2 = screen.queryByLabelText(/page 2/);
      const pageButton3 = screen.queryByLabelText(/page 3/);
      const pageButton4 = screen.queryByLabelText(/page 4/);

      // Then
      expect(pageButton1).not.toBeInTheDocument();
      expect(pageButton2).toBeInTheDocument();
      expect(pageButton3).toBeInTheDocument();
      expect(pageButton4).toBeInTheDocument();
    });

    it('Should not render previous page if it is first', () => {
      // Given
      const pageable: PageableData = {
        isFirst: false,
        isLast: false,
        currentElements: 15,
        currentPage: 0,
        pageSize: 15,
        totalElements: 15 * 6,
        totalPages: 6,
      };

      render(
        <BrowserRouter>
          <Pageable pageable={pageable} maxPages={5} />
        </BrowserRouter>
      );

      // When
      const pageButton1 = screen.queryByLabelText(/page 0/);
      const pageButton2 = screen.queryByLabelText(/page 1/);
      const pageButton3 = screen.queryByLabelText(/page 2/);
      const pageButton4 = screen.queryByLabelText(/page 3/);

      // Then
      expect(pageButton1).not.toBeInTheDocument();
      expect(pageButton2).toBeInTheDocument();
      expect(pageButton3).toBeInTheDocument();
      expect(pageButton4).toBeInTheDocument();
    });

    it('Should not render next page if it is last', () => {
      // Given
      const pageable: PageableData = {
        isFirst: false,
        isLast: false,
        currentElements: 15,
        currentPage: 5,
        pageSize: 15,
        totalElements: 15 * 6,
        totalPages: 6,
      };

      render(
        <BrowserRouter>
          <Pageable pageable={pageable} maxPages={5} />
        </BrowserRouter>
      );

      // When
      const pageButton1 = screen.queryByLabelText(/page 4/);
      const pageButton2 = screen.queryByLabelText(/page 5/);
      const pageButton3 = screen.queryByLabelText(/page 6/);
      const pageButton4 = screen.queryByLabelText(/page 7/);

      // Then
      expect(pageButton1).toBeInTheDocument();
      expect(pageButton2).toBeInTheDocument();
      expect(pageButton3).toBeInTheDocument();
      expect(pageButton4).not.toBeInTheDocument();
    });
  });

  describe('Element count', () => {
    it('Should correctly render elements count on first page', () => {
      // Given
      const pageable: PageableData = {
        isFirst: true,
        isLast: false,
        currentElements: 15,
        currentPage: 0,
        pageSize: 15,
        totalElements: 44,
        totalPages: 3,
      };
      const firstElement = 1;
      const lastElement = pageable.pageSize;

      render(
        <BrowserRouter>
          <Pageable pageable={pageable} />
        </BrowserRouter>
      );

      // When
      const elementsCounter = screen.getByText(
        new RegExp(`${firstElement}\\s+-\\s+${lastElement}`),
        { exact: false }
      );

      // Then
      expect(elementsCounter).toBeInTheDocument();
    });

    it('Should correctly render elements count on middle page', () => {
      // Given
      const pageable: PageableData = {
        isFirst: true,
        isLast: false,
        currentElements: 15,
        currentPage: 1,
        pageSize: 15,
        totalElements: 44,
        totalPages: 3,
      };
      const firstElement = pageable.currentPage * pageable.pageSize + 1;
      const lastElement = pageable.pageSize * (pageable.currentPage + 1);

      render(
        <BrowserRouter>
          <Pageable pageable={pageable} />
        </BrowserRouter>
      );

      // When
      const elementsCounter = screen.getByText(
        new RegExp(`${firstElement}\\s+-\\s+${lastElement}`),
        { exact: false }
      );

      // Then
      expect(elementsCounter).toBeInTheDocument();
    });

    it('Should correctly render elements count on last page', () => {
      // Given
      const pageable: PageableData = {
        isFirst: true,
        isLast: false,
        currentElements: 14,
        currentPage: 2,
        pageSize: 15,
        totalElements: 44,
        totalPages: 3,
      };
      const firstElement = pageable.currentPage * pageable.pageSize + 1;
      const lastElement =
        pageable.pageSize * pageable.currentPage + pageable.currentElements;

      render(
        <BrowserRouter>
          <Pageable pageable={pageable} />
        </BrowserRouter>
      );

      // When
      const elementsCounter = screen.getByText(
        new RegExp(`${firstElement}\\s+-\\s+${lastElement}`),
        { exact: false }
      );

      // Then
      expect(elementsCounter).toBeInTheDocument();
    });

    it('Should correctly render total elements count', () => {
      // Given
      const pageable: PageableData = {
        isFirst: true,
        isLast: false,
        currentElements: 14,
        currentPage: 2,
        pageSize: 15,
        totalElements: 44,
        totalPages: 3,
      };

      render(
        <BrowserRouter>
          <Pageable pageable={pageable} />
        </BrowserRouter>
      );

      // When
      const totalCounter = screen.getByText(pageable.totalElements.toString(), {
        exact: false,
      });

      // Then
      expect(totalCounter).toBeInTheDocument();
    });
  });
});
