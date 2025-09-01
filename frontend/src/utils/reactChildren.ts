import { Children, isValidElement, ReactElement, ReactNode } from 'react';

export const hasChildren = (
  element: ReactNode
): element is ReactElement<{ children: ReactNode | ReactNode[] }> =>
  isValidElement<{ children?: ReactNode[] }>(element) &&
  Boolean(element.props.children);

export const childToString = (child: ReactNode): string => {
  if (
    typeof child === 'undefined' ||
    child === null ||
    typeof child === 'boolean'
  ) {
    return '';
  }

  if (JSON.stringify(child) === '{}') {
    return '';
  }

  // Disabled eslint since we know we can expect string representation of the child
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return child.toString();
};

export const textContent = (children: ReactNode | ReactNode[]): string => {
  if (!(children instanceof Array) && !isValidElement(children)) {
    return childToString(children);
  }

  return Children.toArray(children).reduce(
    (text: string, child: ReactNode): string => {
      let newText = '';

      if (hasChildren(child)) {
        newText = textContent(child.props.children);
      } else if (!isValidElement(child)) {
        newText = childToString(child);
      }

      return text.concat(newText);
    },
    ''
  );
};
