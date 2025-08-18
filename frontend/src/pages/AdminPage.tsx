import AdminSidebar from '../components/shared/navigation/AdminSidebar.tsx';
import { Outlet } from 'react-router-dom';
import { Flex } from '@radix-ui/themes';

/**
 * AdminPage is a functional React component that represents the main
 * layout for an admin section in the application. It combines a sidebar
 * for navigation (AdminSidebar) and dynamic content rendering (Outlet).
 *
 * It is designed to serve as a container for admin-related views.
 */
const AdminPage = () => {
  return (
    <Flex flexGrow="1">
      <AdminSidebar />
      <Outlet />
    </Flex>
  );
};

export default AdminPage;
