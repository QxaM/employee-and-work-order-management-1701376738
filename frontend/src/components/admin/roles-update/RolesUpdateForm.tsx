import { FormEvent } from 'react';
import { RoleType } from '../../../types/api/RoleTypes.ts';
import LoadingSpinner from '../../shared/LoadingSpinner.tsx';
import ErrorComponent from '../../shared/ErrorComponent.tsx';
import { useStateSubmit } from '../../../hooks/useStateSubmit.tsx';
import UserSection from './UserSection.tsx';
import RolesListSection from './RolesListSection.tsx';
import RoleControl from './RoleControl.tsx';
import { useRoleManagement } from '../../../hooks/admin/roles-update/useRoleManagement.tsx';
import { useFormNotifications } from '../../../hooks/useFormNotifications.tsx';
import { QueryError } from '../../../types/api/BaseTypes.ts';
import { Form, ToggleGroup } from 'radix-ui';
import {
  Button,
  Flex,
  Grid,
  Section,
  Separator,
  Skeleton,
} from '@radix-ui/themes';

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

  const handleRoleChange = (roleName: string) => {
    const foundRole = data?.find((role) => role.name === roleName);
    if (foundRole) {
      onRoleClick(foundRole);
    }
  };

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
    <Form.Root onSubmit={handleSubmit}>
      <Flex direction="column" gap="4" mx="2">
        <Separator size="4" />

        <UserSection title="User Data" userId={id} email={email} />

        <Separator size="4" />

        {isError && (
          <Flex dir="col" justify="center" align="center">
            <ErrorComponent error={error ?? defaultRolesError} />
          </Flex>
        )}
        {!isError && (
          <Section aria-label="roles update section" p="0">
            <ToggleGroup.Root
              type="single"
              onValueChange={handleRoleChange}
              asChild
            >
              <Grid
                columns="1fr auto 1fr"
                gap="2"
                justify="center"
                align="stretch"
                minHeight="250px"
              >
                <RolesListSection title="Assigned Roles" roles={currentRoles} />

                <RoleControl
                  onAddRole={onAddRole}
                  onRemoveRole={onRemoveRole}
                />

                <Skeleton loading={isPending}>
                  <Flex flexGrow="1">
                    {isSuccess && (
                      <RolesListSection
                        title="Available Roles"
                        roles={getAvailableRoles(data ?? [])}
                      />
                    )}
                  </Flex>
                </Skeleton>
              </Grid>
            </ToggleGroup.Root>
          </Section>
        )}
        <Section aria-label="form controls" p="0">
          <Flex direction="row" gap="2" align="center" justify="end">
            {!isError && (
              <Flex minWidth="80px" justify="center" align="center">
                <LoadingSpinner size="small" isLoading={submitPending}>
                  <Form.Submit asChild>
                    <Button type="submit" size="3">
                      Update
                    </Button>
                  </Form.Submit>
                </LoadingSpinner>
              </Flex>
            )}
            <Button
              type="button"
              size="3"
              color="gray"
              variant="soft"
              onClick={onClose}
            >
              Close
            </Button>
          </Flex>
        </Section>
      </Flex>
    </Form.Root>
  );
};

export default RolesUpdateForm;
