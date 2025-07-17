interface SelectableFieldProps {
  value: unknown;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

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
