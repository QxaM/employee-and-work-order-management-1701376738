import { copyToClipboard } from '../../src/utils/clipboard.ts';
import { afterEach, beforeEach } from 'vitest';

describe('Clipboard', () => {
  const mockWriteText = vi.fn();

  beforeEach(() => {
    mockWriteText.mockClear();

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
      },
      configurable: true,
    });
  });

  afterEach(() => {
    mockWriteText.mockRestore();
  });

  it('should save to clipboard', async () => {
    // Given
    const text = 'test';

    // When
    await copyToClipboard(text);

    // Then
    expect(mockWriteText).toHaveBeenCalledOnce();
    expect(mockWriteText).toHaveBeenCalledWith(text);
  });
});
