import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import useWindowSize from '../../src/hooks/useWindowSize.tsx';

describe('useWindowSize', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it('should initialize with current window dimensions', () => {
    // Given
    // When
    const { result } = renderHook(() => useWindowSize());

    // Then
    expect(result.current.width).toEqual(1024);
    expect(result.current.height).toEqual(768);
  });

  it('Should correctly update dimensions when window is resized', () => {
    // Given
    const resizeObject = () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1440,
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 900,
      });

      window.dispatchEvent(new Event('resize'));
    };

    const { result } = renderHook(() => useWindowSize());

    // When
    act(resizeObject);

    // Then
    expect(result.current.width).toEqual(1440);
    expect(result.current.height).toEqual(900);
  });

  it('Should add event listener when created', () => {
    // Given
    const addEventListenerMock = vi.spyOn(window, 'addEventListener');

    // When
    renderHook(() => useWindowSize());

    // Then
    expect(addEventListenerMock).toHaveBeenCalledTimes(1);
    expect(addEventListenerMock).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );

    // Cleanup mocks
    addEventListenerMock.mockRestore();
  });

  it('Should add event listener when created', () => {
    // Given
    const removeEventListenerMock = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useWindowSize());

    // When
    unmount();

    // Then
    expect(removeEventListenerMock).toHaveBeenCalledTimes(1);
    expect(removeEventListenerMock).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );

    // Cleanup
    removeEventListenerMock.mockRestore();
  });
});
