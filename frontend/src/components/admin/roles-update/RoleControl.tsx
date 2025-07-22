interface RoleControlProps {
  onAddRole: () => void;
  onRemoveRole: () => void;
}

/**
 * RoleControl is a React functional component that renders controls
 * for adding and removing roles. It consists of two buttons that trigger
 * corresponding action handlers when clicked.
 *
 * @param {Object} props - The props object.
 * @param {Function} props.onAddRole - Callback function invoked when the add role button is clicked.
 * @param {Function} props.onRemoveRole - Callback function invoked when the remove role button is clicked.
 */
const RoleControl = ({ onAddRole, onRemoveRole }: RoleControlProps) => {
  return (
    <section
      aria-label="role control buttons"
      className="flex flex-col gap-1 justify-center items-center my-10"
    >
      <button
        type="button"
        aria-label="add role"
        className="p-2 border border-qxam-accent-lightest rounded hover:bg-qxam-accent-extreme-light hover:shadow-sm"
        onClick={onAddRole}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M10.72 11.47a.75.75 0 0 0 0 1.06l7.5 7.5a.75.75 0 1 0 1.06-1.06L12.31 12l6.97-6.97a.75.75 0 0 0-1.06-1.06l-7.5 7.5Z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M4.72 11.47a.75.75 0 0 0 0 1.06l7.5 7.5a.75.75 0 1 0 1.06-1.06L6.31 12l6.97-6.97a.75.75 0 0 0-1.06-1.06l-7.5 7.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <span aria-hidden>-</span>
      <button
        type="button"
        aria-label="remove role"
        className="p-2 border border-qxam-accent-lightest rounded hover:bg-qxam-accent-extreme-light hover:shadow-sm"
        onClick={onRemoveRole}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </section>
  );
};

export default RoleControl;
