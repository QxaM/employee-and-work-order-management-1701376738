import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PageButton from '../../../../src/components/shared/pageable/PageButton.tsx';

describe('PageButton', () => {
  it('Should navigate to page', () => {
    // Given
    const toPage = 1;
    const currentPage = 0;
    const pageLabel = `page ${toPage + 1}`;

    render(
      <BrowserRouter>
        <PageButton toPage={toPage} currentPage={currentPage} color="violet" />
      </BrowserRouter>
    );
    const pageButton = screen.getByLabelText(pageLabel);

    // When
    fireEvent.click(pageButton);

    // Then
    expect(window.location.search.endsWith(`?page=${toPage}`)).toBe(true);
  });
});
