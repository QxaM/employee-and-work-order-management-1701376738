import { describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PageContent from '../../../../src/components/shared/pageable/PageContent.tsx';

describe('Page Content', () => {
  it('Should contain elements counter', () => {
    // Given
    const elementsRegex = /\d+\s+-\s+\d+\s+element\(s\)\s+of\s+\d+/;
    const currentElements = 1;
    const startElement = 1;
    const totalElements = 1;

    render(
      <PageContent
        currentElements={currentElements}
        startElement={startElement}
        totalElements={totalElements}
      />
    );

    // When
    const elementsCounter = screen.getByText(elementsRegex);

    // Then
    expect(elementsCounter).toBeInTheDocument();
  });

  it('Should contain total elements count', () => {
    // Given
    const currentElements = 14;
    const startElement = 31;
    const totalElements = 44;

    render(
      <BrowserRouter>
        <PageContent
          currentElements={currentElements}
          startElement={startElement}
          totalElements={totalElements}
        />
      </BrowserRouter>
    );

    // When
    const totalCounter = screen.getByText(totalElements.toString(), {
      exact: false,
    });

    // Then
    expect(totalCounter).toBeInTheDocument();
  });
});
