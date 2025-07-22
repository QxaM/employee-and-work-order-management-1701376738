interface DisplayFieldProps {
  title: string;
  value: unknown;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

/**
 * DisplayField is a functional component used for displaying a labeled value with a customizable layout and styling.
 *
 * @param {object} props - Configuration object for the DisplayField component.
 * @param {string} props.title - The label or title to be displayed.
 * @param {string|number} props.value - The value to be displayed next to the label.
 * @param {string} [props.orientation='vertical'] - Determines the layout of the label and value. Accepts 'vertical' (default) or 'horizontal'.
 * @param {string} [props.className] - Additional custom CSS class names to apply to the component.
 *
 */
const DisplayField = ({
  title,
  value,
  orientation = 'vertical',
  className,
}: DisplayFieldProps) => {
  const gridOrientation =
    orientation === 'vertical' ? 'grid-row-2 gap-1' : 'grid-cols-2';
  const elementClass = `grid ${gridOrientation} place-items-start ${className}`;

  return (
    <div data-testid="display-field" className={elementClass}>
      <label>{title}:</label>
      <data className="border px-2 font-medium shadow-inner border-qxam-neutral-light-darker bg-qxam-neutral-light-lighter rounded-sm">
        {value as string}
      </data>
    </div>
  );
};

export default DisplayField;
