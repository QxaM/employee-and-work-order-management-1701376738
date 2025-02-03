import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import RootPage from './pages/RootPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import { queryClient } from './api/base.ts';
import { Provider } from 'react-redux';
import { setupStore } from './store';
import DialogManager from './components/DialogManager.tsx';
import LoginPage from './pages/LoginPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      { index: true, element: <></> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/login', element: <LoginPage /> },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={setupStore()}>
        <RouterProvider router={router} />
        <DialogManager />
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
