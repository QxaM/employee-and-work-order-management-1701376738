import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import RootPage from './pages/RootPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import { queryClient } from './api/base.ts';
import { Provider } from 'react-redux';
import { setupStore } from './store';
import DialogManager from './components/DialogManager.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterConfirmationPage from './pages/RegisterConfirmationPage.tsx';
import PasswordRequestPage from './pages/PasswordRequestPage.tsx';
import PasswordUpdatePage from './pages/PasswordUpdatePage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      { index: true, element: <></> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/register/confirm', element: <RegisterConfirmationPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/password/request', element: <PasswordRequestPage /> },
      { path: '/password/confirm', element: <PasswordUpdatePage /> },
    ],
  },
]);

function App() {
  const storedToken = localStorage.getItem('token');
  const preloadedState = storedToken ? { auth: { token: storedToken } } : {};

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={setupStore(preloadedState)}>
        <RouterProvider router={router} />
        <DialogManager />
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
