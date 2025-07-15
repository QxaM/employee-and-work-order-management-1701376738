interface DisplayFieldProps {
  title: string;
  value: unknown;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

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
