import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import RootPage from './pages/RootPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import { Provider } from 'react-redux';
import { store } from './store';
import DialogManager from './components/DialogManager.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterConfirmationPage from './pages/RegisterConfirmationPage.tsx';
import PasswordRequestPage from './pages/PasswordRequestPage.tsx';
import PasswordUpdatePage from './pages/PasswordUpdatePage.tsx';
import AdminPage from './pages/admin/AdminPage.tsx';
import RolesUpdatePage from './pages/admin/RolesUpdatePage.tsx';
import { loadUsers } from './api/loaders/user.loader.ts';
import ProtectedRoute from './components/shared/ProtectedRoute.tsx';
import ErrorElement from './components/shared/router/ErrorElement.tsx';
import ModalProvider from './components/shared/modal/ModalProvider.tsx';
import HomePage from './pages/HomePage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import TasksPage from './pages/TasksPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    errorElement: <ErrorElement />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/register/confirm', element: <RegisterConfirmationPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/password/request', element: <PasswordRequestPage /> },
      { path: '/password/confirm', element: <PasswordUpdatePage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/tasks', element: <TasksPage /> },
      {
        path: '/admin',
        element: (
          <ProtectedRoute roles={['ADMIN']}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminPage /> },
          {
            path: 'roles-update',
            element: <RolesUpdatePage />,
            errorElement: <ErrorElement />,
            loader: (loaderFunctionArgs) =>
              loadUsers(store, loaderFunctionArgs),
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <ModalProvider>
        <RouterProvider router={router} />
        <DialogManager />
      </ModalProvider>
    </Provider>
  );
}

export default App;
