import { FormEvent } from 'react';
import { RoleType } from '../../../types/RoleTypes.ts';
import LoadingSpinner from '../../shared/LoadingSpinner.tsx';
import ErrorComponent from '../../shared/ErrorComponent.tsx';
import { useStateSubmit } from '../../../hooks/useStateSubmit.tsx';
import UserSection from './UserSection.tsx';
import RolesListSection from './RolesListSection.tsx';
import RoleControl from './RoleControl.tsx';
import { useRoleManagement } from '../../../hooks/admin/roles-update/useRoleManagement.tsx';
import { useFormNotifications } from '../../../hooks/useFormNotifications.tsx';
import { QueryError } from '../../../types/ApiTypes.ts';

interface RolesUpdateFormProps {
  user: {
    id: number;
    email: string;
    roles: RoleType[];
  };
  roles: {
    data: RoleType[] | undefined;
    isSuccess: boolean;
    isPending: boolean;
    isError: boolean;
    error: QueryError;
  };
  onClose?: () => void;
}

/**
 * RolesUpdateForm is a React functional component responsible for managing and updating roles for a specified user.
 * It facilitates viewing, adding, and removing roles.
 *
 * @param {Object} props The properties passed to the component.
 * @param {Object} props.user The user information.
 * @param {number} props.user.id The unique identifier of the user.
 * @param {string} props.user.email The email address of the user.
 * @param {Array} props.user.roles The roles currently assigned to the user.
 * @param {Object} props.roles The roles data fetched from the backend.
 * @param {Array} props.roles.data The available roles data.
 * @param {boolean} props.roles.isSuccess Status indicating if the roles data was successfully fetched.
 * @param {boolean} props.roles.isPending Status indicating if the roles data is being fetched.
 * @param {boolean} props.roles.isError Status indicating if there was an error in fetching roles data.
 * @param {Object} props.roles.error The error object containing the details of the error that occurred.
 * @param {Function} props.onClose A callback function invoked when the form is closed.
 */
const RolesUpdateForm = ({
  user: { id, email, roles },
  roles: { data, isSuccess, isPending, isError, error },
  onClose,
}: RolesUpdateFormProps) => {
  const defaultRolesError = 'Error while fetching roles data, try again later';
  const {
    selectedRole,
    currentRoles,
    getAvailableRoles,
    getRolesToAdd,
    getRolesToRemove,
    onRoleClick,
    onAddRole,
    onRemoveRole,
  } = useRoleManagement(roles);
  const {
    submit,
    isSuccess: submitSuccess,
    isPending: submitPending,
    isError: submitError,
    error: submitErrorValue,
  } = useStateSubmit(null);

  useFormNotifications({
    success: {
      status: submitSuccess,
      message: `Successfully updated roles for user ${id}`,
      onEvent: onClose,
    },
    error: {
      status: submitError,
      message:
        submitErrorValue?.message ??
        `Error while updating roles for user ${id}`,
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const rolesToUpdate = getRolesToAdd(roles);
    const rolesToRemove = getRolesToRemove(roles);

    const submitData = {
      userId: id,
      addRoles: JSON.stringify(rolesToUpdate),
      removeRoles: JSON.stringify(rolesToRemove),
    };
    submit(submitData, {
      method: 'PATCH',
      encType: 'application/json',
    });
  };

  return (
    <form
      aria-labelledby="roles-update-form-title"
      className="flex flex-col m-2 gap-4"
      onSubmit={handleSubmit}
    >
      <h3 id="roles-update-form-title" className="font-bold text-md">
        Roles Update Form
      </h3>
      <UserSection title="User Data" userId={id} email={email} />

      {isError && (
        <div className="flex flex-col justify-center items-center">
          <ErrorComponent error={error ?? defaultRolesError} />
        </div>
      )}
      {!isError && (
        <section
          aria-label="roles update section"
          className="grid grid-cols-[1fr_max-content_1fr] gap-2"
        >
          <RolesListSection
            title="Assigned Roles"
            roles={currentRoles}
            selectedRole={selectedRole}
            onRoleClick={onRoleClick}
          />

          <RoleControl onAddRole={onAddRole} onRemoveRole={onRemoveRole} />

          {isPending && (
            <section className="flex flex-col justify-center items-center">
              <LoadingSpinner color="accent" />
            </section>
          )}
          {isSuccess && (
            <RolesListSection
              title="Available Roles"
              roles={getAvailableRoles(data ?? [])}
              selectedRole={selectedRole}
              onRoleClick={onRoleClick}
            />
          )}
        </section>
      )}
      <section
        aria-label="form controls"
        className="flex flex-row gap-2 justify-end items-center"
      >
        {!isError && !submitPending && (
          <button
            type="submit"
            className="btn btn-secondary-lightest text-md min-w-20 border-qxam-neutral-dark-lightest border rounded text-center"
          >
            Update
          </button>
        )}
        {submitPending && (
          <div className="min-w-20 flex justify-center items-center">
            <LoadingSpinner size="small" color="accent" />
          </div>
        )}
        <button
          type="button"
          className="btn btn-neutral-light text-md min-w-20 border-qxam-neutral-dark-lightest border rounded text-center"
          onClick={onClose}
        >
          Close
        </button>
      </section>
    </form>
  );
};

export default RolesUpdateForm;
