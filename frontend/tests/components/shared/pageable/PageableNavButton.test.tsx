import { BrowserRouter } from 'react-router-dom';
import PageableNavButton from '../../../../src/components/shared/pageable/PageableNavButton.tsx';
import { fireEvent, render, screen } from '@testing-library/react';

describe('PageableNavButton', () => {
  const previousLabel = 'previous page';
  const nextLabel = 'next page';

  it('Should navigate to previous page', () => {
    // Given
    const currentPage = 1;
    const previousPage = currentPage - 1;
    const isDisabled = false;

    render(
      <BrowserRouter>
        <PageableNavButton
          direction="previous"
          currentPage={currentPage}
          isDisabled={isDisabled}
          color="violet"
        />
      </BrowserRouter>
    );
    const previousButton = screen.getByLabelText(previousLabel);

    // When
    fireEvent.click(previousButton);

    // Then
    expect(window.location.search.endsWith(`?page=${previousPage}`)).toBe(true);
  });

  it('Should navigate to next page', () => {
    // Given
    const currentPage = 1;
    const nextPage = currentPage + 1;
    const isDisabled = false;

    render(
      <BrowserRouter>
        <PageableNavButton
          direction="next"
          currentPage={currentPage}
          isDisabled={isDisabled}
          color="violet"
        />
      </BrowserRouter>
    );
    const nextButton = screen.getByLabelText(nextLabel);

    // When
    fireEvent.click(nextButton);

    // Then
    expect(window.location.search.endsWith(`?page=${nextPage}`)).toBe(true);
  });

  it('Should disable a button', () => {
    // Given
    const currentPage = 1;
    const isDisabled = true;

    render(
      <BrowserRouter>
        <PageableNavButton
          direction="next"
          currentPage={currentPage}
          isDisabled={isDisabled}
          color="violet"
        />
      </BrowserRouter>
    );

    // When
    const nextButton = screen.getByLabelText(nextLabel);

    // Then
    expect(nextButton.getAttribute('class')).toContain('pointer-events-none');
  });
});
