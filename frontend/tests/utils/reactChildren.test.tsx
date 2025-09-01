import {
  childToString,
  hasChildren,
  textContent,
} from '../../src/utils/reactChildren.ts';
import { ReactNode } from 'react';

describe('reactChildren', () => {
  describe('hasChildren', () => {
    it('Should return true, when has children', () => {
      // Given
      const element = (
        <div>
          <div />
          <div />
        </div>
      );

      // When
      const result = hasChildren(element);

      // Then
      expect(result).toBe(true);
    });

    it('Should return true, when has string', () => {
      // Given
      const element = <div>Text</div>;

      // When
      const result = hasChildren(element);

      // Then
      expect(result).toBe(true);
    });

    it('Should return true, when has number', () => {
      // Given
      const element = <div>{3}</div>;

      // When
      const result = hasChildren(element);

      // Then
      expect(result).toBe(true);
    });

    it('Should return true, when has boolean', () => {
      // Given
      const element = <div>{true}</div>;

      // When
      const result = hasChildren(element);

      // Then
      expect(result).toBe(true);
    });

    it('Should return true, when has combined', () => {
      // Given
      const element = (
        <div>
          Text
          {true}
          <div />
        </div>
      );

      // When
      const result = hasChildren(element);

      // Then
      expect(result).toBe(true);
    });

    it('Should return true, when combined with null', () => {
      // Given
      const element = (
        <div>
          Text
          {true}
          {null}
          <div />
        </div>
      );

      // When
      const result = hasChildren(element);

      // Then
      expect(result).toBe(true);
    });

    it('Should return false, when empty', () => {
      // Given
      const element = <div />;

      // When
      const result = hasChildren(element);

      // Then
      expect(result).toBe(false);
    });

    it('Should return false, when null', () => {
      // Given
      const element = <div>{null}</div>;

      // When
      const result = hasChildren(element);

      // Then
      expect(result).toBe(false);
    });

    it('Should return false, when false', () => {
      // Given
      const element = <div>{false}</div>;

      // When
      const result = hasChildren(element);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('childToString', () => {
    it('Should return string, when string', () => {
      // Given
      const child = 'text';

      // When
      const result = childToString(child);

      // Then
      expect(result).toEqual(child);
    });

    it('Should return string, when number', () => {
      // Given
      const child = 2;

      // When
      const result = childToString(child);

      // Then
      expect(result).toEqual(child.toString());
    });

    it('Should return empty, when boolean', () => {
      // Given
      const child = true;

      // When
      const result = childToString(child);

      // Then
      expect(result).toEqual('');
    });

    it('Should return empty, when empty object', () => {
      // Given
      const child = {};

      // When
      const result = childToString(child as ReactNode);

      // Then
      expect(result).toEqual('');
    });

    it('Should return empty, when null', () => {
      // Given
      const child = null;

      // When
      const result = childToString(child);

      // Then
      expect(result).toEqual('');
    });

    it('Should return empty, when undefined', () => {
      // Given
      const child = undefined;

      // When
      const result = childToString(child);

      // Then
      expect(result).toEqual('');
    });
  });

  describe('textContent', () => {
    it('Should return correctly on text', () => {
      // Given
      const value = 'Text';
      const element = <div>{value}</div>;

      // When
      const result = textContent(element);

      // Then
      expect(result).toEqual(value);
    });

    it('Should return correctly on number', () => {
      // Given
      const value = 2;
      const element = <div>{value}</div>;

      // When
      const result = textContent(element);

      // Then
      expect(result).toEqual(value.toString());
    });

    it('Should return correctly on boolean', () => {
      // Given
      const valueTrue = true;
      const valueFalse = false;
      const elementTrue = <div>{valueTrue}</div>;
      const elementFalse = <div>{valueFalse}</div>;

      // When
      const resultTrue = textContent(elementTrue);
      const resultFalse = textContent(elementFalse);

      // Then
      expect(resultTrue).toEqual('');
      expect(resultFalse).toEqual('');
    });

    it('Should return correctly on null', () => {
      // Given
      const value = null;
      const element = <div>{value}</div>;

      // When
      const result = textContent(element);

      // Then
      expect(result).toEqual('');
    });

    it('Should return correctly on combined types', () => {
      // Given
      const valueString = 'Text';
      const valueNumber = 2;
      const valueBoolean = true;
      const valueNull = null;
      const element = (
        <div>
          {valueString}
          {valueNumber}
          {valueBoolean}
          {valueNull}
        </div>
      );

      // When
      const result = textContent(element);

      // Then
      expect(result).toEqual(valueString + valueNumber.toString());
    });

    it('Should return correctly on non nested objects', () => {
      // Given
      const valueString = 'Text';
      const valueNumber = 2;
      const element = (
        <>
          <div>{valueString}</div>
          <div>{valueNumber}</div>
        </>
      );

      // When
      const result = textContent(element);

      // Then
      expect(result).toEqual(valueString + valueNumber.toString());
    });

    it('Should return correctly on nested objects', () => {
      // Given
      const valueString = 'Text';
      const valueNumber = 2;
      const element = (
        <>
          <div>{valueString}</div>
          <div>
            {valueNumber}
            <div>Nested</div>
          </div>
        </>
      );

      // When
      const result = textContent(element);

      // Then
      expect(result).toEqual(valueString + valueNumber.toString() + 'Nested');
    });

    it('Should return correctly on empty', () => {
      // Given
      const element = <div />;

      // When
      const result = textContent(element);

      // Then
      expect(result).toEqual('');
    });

    it('Should return correctly on empty children', () => {
      // Given
      const element = (
        <div>
          <div />
        </div>
      );

      // When
      const result = textContent(element);

      // Then
      expect(result).toEqual('');
    });
  });
});
