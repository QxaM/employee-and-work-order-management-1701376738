import AdminSidebar from '../components/shared/navigation/AdminSidebar.tsx';
import { Outlet } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div className="flex flex-row flex-grow">
      <AdminSidebar />
      <Outlet />
    </div>
  );
};

export default AdminPage;
