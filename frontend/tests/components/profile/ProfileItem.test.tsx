import { render, screen } from '@testing-library/react';
import ProfileItem from '../../../src/components/profile/ProfileItem.tsx';
import { DataList } from '@radix-ui/themes';

describe('ProfileItem', () => {
  describe('Title', () => {
    it('Should render title', () => {
      // Given
      const title = 'Test Title';
      render(<ProfileItem isLoading={false} title={title} />, {
        wrapper: DataList.Root,
      });

      // When
      const titleElement = screen.getByText(title);

      // Then
      expect(titleElement).toBeInTheDocument();
    });

    it('Should not render title when not provided', () => {
      // Given
      render(<ProfileItem isLoading={false} />, {
        wrapper: DataList.Root,
      });

      // When
      const titleElement = screen.queryByRole('term');

      // Then
      expect(titleElement).not.toBeInTheDocument();
    });
  });

  describe('Value', () => {
    const children = 'Test children';

    it('Should render children', () => {
      // Given
      render(<ProfileItem isLoading={false}>{children}</ProfileItem>, {
        wrapper: DataList.Root,
      });

      // When
      const childrenElement = screen.getByText(children);

      // Then
      expect(childrenElement).toBeInTheDocument();
    });

    it('Should render skeleton when loading', () => {
      // Given
      render(<ProfileItem isLoading={true}>{children}</ProfileItem>, {
        wrapper: DataList.Root,
      });

      // When
      const childrenElement = screen.queryByRole('definition');

      // Then
      expect(childrenElement).not.toBeInTheDocument();
    });
  });
});
