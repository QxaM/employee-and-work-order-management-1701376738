import { render, screen } from '@testing-library/react';
import PasswordRequirements from '../../../../src/components/shared/form/PasswordRequirements.tsx';

describe('PasswordRequirements', () => {
  const MIN_LENGTH = 4;
  const minimumLength = `At least ${MIN_LENGTH} characters`;
  const uppercaseLetter = 'At least 1 uppercase letter';
  const lowercaseLetter = 'At least 1 lowercase letter';
  const number = 'At least 1 number';
  const title = 'Password Requirements';

  describe('Render elements', () => {
    it('Should contain title', () => {
      // Given
      render(<PasswordRequirements password="test" />);

      // When
      const titleElement = screen.getByText(title);

      // Then
      expect(titleElement).toBeInTheDocument();
    });

    it('Should contain all requirements', () => {
      // Given
      render(<PasswordRequirements password="test" />);

      // When
      const minimumLengthElement = screen.getByText(minimumLength);
      const uppercaseElement = screen.getByText(uppercaseLetter);
      const lowercaseElement = screen.getByText(lowercaseLetter);
      const numberElement = screen.getByText(number);

      // Then
      expect(minimumLengthElement).toBeInTheDocument();
      expect(uppercaseElement).toBeInTheDocument();
      expect(lowercaseElement).toBeInTheDocument();
      expect(numberElement).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    const highlightClass = '!text-(--green-11)';

    it('Should highlight minimum length', () => {
      // Given
      render(<PasswordRequirements password="test" />);

      // When
      const minimumLengthElement = screen.getByText(minimumLength);

      // Then
      expect(minimumLengthElement).toHaveClass(highlightClass);
    });

    it('Should highlight uppercase letter', () => {
      // Given
      render(<PasswordRequirements password="T" />);

      // When
      const uppercaseElement = screen.getByText(uppercaseLetter);

      // Then
      expect(uppercaseElement).toHaveClass(highlightClass);
    });

    it('Should highlight lowercase letter', () => {
      // Given
      render(<PasswordRequirements password="t" />);

      // When
      const lowercaseElement = screen.getByText(lowercaseLetter);

      // Then
      expect(lowercaseElement).toHaveClass(highlightClass);
    });

    it('Should highlight number', () => {
      // Given
      render(<PasswordRequirements password="1" />);

      // When
      const numberElement = screen.getByText(number);

      // Then
      expect(numberElement).toHaveClass(highlightClass);
    });

    it('Should highlight title', () => {
      // Given
      render(<PasswordRequirements password="Test12345" />);

      // When
      const titleElement = screen.getByText(title);

      // Then
      expect(titleElement).toHaveClass(highlightClass);
    });
  });
});
