import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import RootPage from './pages/RootPage.tsx';
import Input from './components/shared/Input';
import { ValidatorType } from '@/types/ValidatorTypes.ts';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        index: true,
        element: (
          <>
            <Input
              title="Test"
              placeholder="test placeholder"
              validator={(value: string) =>
                ({
                  isValid: value.length > 0,
                  message: 'Test error',
                }) as ValidatorType
              }
            />
          </>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
