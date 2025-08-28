import { Grid, Separator } from '@radix-ui/themes';
import CurrentRoles from './roles-list/CurrentRoles.tsx';
import AvailableRoles from './roles-list/AvailableRoles.tsx';
import { useGetRolesQuery } from '../../../store/api/role.ts';
import LoadingSpinner from '../../shared/LoadingSpinner.tsx';
import ErrorComponent from '../../shared/ErrorComponent.tsx';
import { UserType } from '../../../types/api/UserTypes.ts';

interface RolesListSectionProps {
  user: UserType;
}

/**
 * A React functional component that renders a section displaying a list of roles as selectable items.
 *
 * @param {Object} props - The properties passed to the component.
 */
const RolesListSection = ({ user }: RolesListSectionProps) => {
  const { id: userId, roles: userRoles } = user;
  const { data: allRoles, isFetching, isError, error } = useGetRolesQuery();

  return (
    <Grid
      columns={{ initial: '1', sm: '1fr auto 1fr' }}
      rows={{ initial: '1fr auto 1fr', sm: '1' }}
      align="center"
      width="100%"
      gap="2"
    >
      <CurrentRoles userId={userId} currentRoles={userRoles} />
      <Separator
        orientation={{ initial: 'horizontal', sm: 'vertical' }}
        size={{ initial: '4', sm: '1' }}
      />
      {isError && <ErrorComponent error={error} />}
      {!isError && (
        <LoadingSpinner size="small" isLoading={isFetching}>
          {allRoles && (
            <AvailableRoles
              userId={userId}
              availableRoles={allRoles.filter(
                (role) => !userRoles.some((userRole) => role.id === userRole.id)
              )}
            />
          )}
        </LoadingSpinner>
      )}
    </Grid>
  );
};

export default RolesListSection;
