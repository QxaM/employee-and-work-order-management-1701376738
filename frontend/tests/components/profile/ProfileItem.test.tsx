import { render, screen } from '@testing-library/react';
import ProfileItem from '../../../src/components/profile/ProfileItem.tsx';
import { DataList } from '@radix-ui/themes';
import { FormEvent, PropsWithChildren } from 'react';
import { Form } from 'radix-ui';

const TestWrapper = ({ children }: PropsWithChildren) => {
  return (
    <Form.Root
      onSubmit={vi
        .fn()
        .mockImplementation((event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
        })}
    >
      <DataList.Root>{children}</DataList.Root>
    </Form.Root>
  );
};

describe('ProfileItem', () => {
  describe('Title', () => {
    it('Should render title', () => {
      // Given
      const title = 'Test Title';
      render(<ProfileItem isLoading={false} isEdited={false} title={title} />, {
        wrapper: TestWrapper,
      });

      // When
      const titleElement = screen.getByText(title);

      // Then
      expect(titleElement).toBeInTheDocument();
    });

    it('Should not render title when not provided', () => {
      // Given
      render(<ProfileItem isLoading={false} isEdited={false} />, {
        wrapper: TestWrapper,
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
      render(
        <ProfileItem isLoading={false} isEdited={false}>
          {children}
        </ProfileItem>,
        {
          wrapper: TestWrapper,
        }
      );

      // When
      const childrenElement = screen.getByText(children);

      // Then
      expect(childrenElement).toBeInTheDocument();
    });

    it('Should render skeleton when loading', () => {
      // Given
      render(
        <ProfileItem isLoading={true} isEdited={false}>
          {children}
        </ProfileItem>,
        {
          wrapper: TestWrapper,
        }
      );

      // When
      const childrenElement = screen.queryByRole('definition');

      // Then
      expect(childrenElement).not.toBeInTheDocument();
    });

    it('Should render textbox when editing', () => {
      // Given
      render(
        <ProfileItem isLoading={true} isEdited={true}>
          {children}
        </ProfileItem>,
        {
          wrapper: TestWrapper,
        }
      );

      // When
      const textboxElement = screen.getByRole('textbox');

      // Then
      expect(textboxElement).toBeInTheDocument();
    });

    it('Should inject value to textbox when editing', () => {
      // Given
      render(
        <ProfileItem isLoading={true} isEdited={true}>
          {children}
        </ProfileItem>,
        {
          wrapper: TestWrapper,
        }
      );

      // When
      const textboxElement = screen.getByRole('textbox');

      // Then
      expect(textboxElement).toHaveValue(children);
    });
  });
});
