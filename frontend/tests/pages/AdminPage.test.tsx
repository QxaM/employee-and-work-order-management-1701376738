import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from '../test-utils.tsx';
import AdminPage from '../../src/pages/AdminPage.tsx';
import { BrowserRouter } from 'react-router-dom';

describe('AdminPage', () => {
  const cards = {
    rolesUpdate: {
      title: 'Roles Update',
      description: "View and update users' roles",
      to: '/admin/roles-update',
    },
  };

  it('Should contain title and description', () => {
    // Given
    const title = 'Navigate to one of the following pages';
    const description =
      'Select a section to manage different aspects of your application';

    renderWithProviders(
      <BrowserRouter>
        <AdminPage />
      </BrowserRouter>
    );

    // When
    const titleElement = screen.getByRole('heading', { name: title });
    const descriptionElement = screen.getByText(description);

    // Then
    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  it('Should contain correct cards', () => {
    // Given
    renderWithProviders(
      <BrowserRouter>
        <AdminPage />
      </BrowserRouter>
    );

    // When
    const rolesUpdateElements = {
      title: screen.getByText(cards.rolesUpdate.title),
      description: screen.getByText(cards.rolesUpdate.description),
    };

    // Then
    expect(rolesUpdateElements.title).toBeInTheDocument();
    expect(rolesUpdateElements.description).toBeInTheDocument();
  });

  describe('Navigation', () => {
    it('Should navigate to roles update page', () => {
      // Given
      renderWithProviders(
        <BrowserRouter>
          <AdminPage />
        </BrowserRouter>
      );
      const rolesUpdateElement = screen.getByText(cards.rolesUpdate.title);

      // When
      fireEvent.click(rolesUpdateElement);

      // Then
      expect(window.location.pathname).toContain(cards.rolesUpdate.to);
    });
  });
});
