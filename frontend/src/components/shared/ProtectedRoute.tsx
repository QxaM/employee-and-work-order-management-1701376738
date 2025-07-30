import { PropsWithChildren, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { Role } from '../../types/AuthorizationTypes.ts';
import { useAppDispatch } from '../../hooks/useStore.tsx';
import { useMeData } from '../../hooks/useMeData.tsx';
import { registerModal } from '../../store/modalSlice.ts';

interface ProtectedRouteProps {
  roles?: Role[];
}

/**
 * A component that renders its children only if the current user is authorized based on the provided roles.
 * It handles user authentication and authorization checks, showing appropriate messages and
 * redirecting as necessary.
 *
 * @param {Object} props - The props for the ProtectedRoute component.
 * @param {string[]} props.roles - An array of roles required to access the route. The user must have all specified roles to proceed.
 * @param {React.ReactNode} props.children - The child components to render if the user is authorized.
 *
 * Redirects:
 * - If the user is not logged in and an error occurs (e.g., invalid session), they are redirected to the login page.
 * - If the user is logged in but not authorized, they are redirected to the home page.
 *
 * Behavior:
 * - Displays a modal message if the user is not logged in or is unauthorized.
 * - Waits for loading to complete before evaluating authorization.
 */
const ProtectedRoute = ({
  roles,
  children,
}: PropsWithChildren<ProtectedRouteProps>) => {
  const dispatch = useAppDispatch();
  const { me, isLoading, isError } = useMeData();

  const isAuthorized = useMemo(() => {
    if (!me) {
      return false;
    }
    if (!roles) {
      return true;
    }
    return roles.every((role) =>
      me.roles.some((userRole) => userRole.name === role)
    );
  }, [me, roles]);

  useEffect(() => {
    if (isError) {
      dispatch(
        registerModal({
          id: uuidv4(),
          content: {
            message: 'You are not logged in! Please log in.',
            type: 'info',
          },
        })
      );
    }
  }, [dispatch, isError]);

  useEffect(() => {
    if (me && !isAuthorized) {
      dispatch(
        registerModal({
          id: uuidv4(),
          content: {
            message:
              'You are not authorized to access this page. Please log in.',
            type: 'info',
          },
        })
      );
    }
  }, [dispatch, isAuthorized, me]);

  if (isLoading) {
    return null;
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  if (me && !isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
