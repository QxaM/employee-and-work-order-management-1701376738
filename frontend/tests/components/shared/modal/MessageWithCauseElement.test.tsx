import { MessageWithCause } from '../../../../src/types/components/ModalTypes.tsx';
import { render, screen } from '@testing-library/react';
import MessageWithCauseElement from '../../../../src/components/shared/modal/MessageWithCauseElement.tsx';

describe('MessageWithCauseElement', () => {
  const messageWithCause: MessageWithCause = {
    message: 'Test message',
    cause: ['Cause 1', 'Cause 2'],
  };

  it('Should render message', () => {
    // Given
    render(<MessageWithCauseElement errorData={messageWithCause} />);

    // When
    const messageElement = screen.getByText(messageWithCause.message);

    // Then
    expect(messageElement).toBeInTheDocument();
  });

  it('Should render causes', () => {
    // Given
    render(<MessageWithCauseElement errorData={messageWithCause} />);

    // When
    const causeElements = messageWithCause.cause.map((causeMessage) =>
      screen.getByText(causeMessage)
    );

    // Then
    expect(causeElements).toHaveLength(messageWithCause.cause.length);
    causeElements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });
});
