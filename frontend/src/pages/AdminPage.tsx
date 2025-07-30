import AdminSidebar from '../components/shared/navigation/AdminSidebar.tsx';
import { Outlet } from 'react-router-dom';

/**
 * AdminPage is a functional React component that represents the main
 * layout for an admin section in the application. It combines a sidebar
 * for navigation (AdminSidebar) and dynamic content rendering (Outlet).
 *
 * It is designed to serve as a container for admin-related views.
 */
const AdminPage = () => {
  return (
    <div className="flex flex-row flex-grow">
      <AdminSidebar />
      <Outlet />
    </div>
  );
};

export default AdminPage;
