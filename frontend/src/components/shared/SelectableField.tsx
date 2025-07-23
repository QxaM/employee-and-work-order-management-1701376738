interface SelectableFieldProps {
  value: unknown;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * A functional component representing a selectable field element.
 * Can be styled based on selection state and accepts user-defined click handling.
 *
 * @param {Object} props - The properties object passed to the component.
 * @param {string} props.value - The display value of the selectable field.
 * @param {boolean} props.isSelected - Indicates if the field is currently selected.
 * @param {Function} props.onClick - Callback function triggered when the field is clicked.
 * @param {string} [props.className] - Additional class names to customize the styling.
 */
const SelectableField = ({
  value,
  isSelected,
  onClick,
  className,
}: SelectableFieldProps) => {
  const notSelectedClass =
    'shadow-inner bg-qxam-neutral-light-lighter hover:bg-qxam-secondary-extreme-light';
  const selectedClass =
    'shadow-sm bg-qxam-secondary-lightest hover:bg-qxam-secondary-lighter hover:shadow';

  return (
    <button
      type="button"
      className={`border px-2 font-medium rounded-sm cursorPointer border-qxam-neutral-light-darker ${isSelected ? selectedClass : notSelectedClass} ${className}`}
      onClick={onClick}
    >
      {value as string}
    </button>
  );
};

export default SelectableField;
