import { render, screen } from '@testing-library/react';
import TasksPage from '../../src/pages/TasksPage.tsx';

describe('TasksPage', () => {
  it('should render TasksListTitle', () => {
    // Given
    const headingTitle = 'Tasks';

    // When
    render(<TasksPage />);

    const headingElement = screen.getByRole('heading', { name: headingTitle });

    // Then
    expect(headingElement).toBeInTheDocument();
  });
});
