import { render, renderHook, RenderOptions } from '@testing-library/react';
import { AppStore, RootState, setupStore } from '../src/store';
import { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import {
  createMemoryRouter,
  LoaderFunction,
  RouterProvider,
} from 'react-router-dom';
import { ActionResponse } from '../src/types/ActionTypes.ts';
import ModalProvider from '../src/components/shared/modal/ModalProvider.tsx';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export const renderWithProviders = (
  ui: ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {}
) => {
  const {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions;

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    store,
  };
};

export const renderWithProvidersAndModals = (
  ui: ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {}
) => {
  const {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions;

  const Wrapper = ({ children }: PropsWithChildren) => (
    <ModalProvider>
      <Provider store={store}>{children}</Provider>
    </ModalProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    store,
  };
};

export const renderHookWithProviders = <R, P = unknown>(
  render: (initialProps: P) => R,
  extendedRenderOptions: ExtendedRenderOptions = {}
) => {
  const {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions;

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    ...renderHook(render, { wrapper: Wrapper, ...renderOptions }),
    store,
  };
};

export const createDataRouter = (
  path: string,
  child: ReactNode,
  loader?: LoaderFunction
) => {
  return createMemoryRouter(
    [
      {
        path,
        element: <>{child}</>,
        loader,
      },
    ],
    {
      initialEntries: [path],
    }
  );
};

export function createHookDataRouter<T>(actionData?: ActionResponse<T>) {
  const TestWrapper = ({ children }: PropsWithChildren) => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <>{children}</>,
          action: vi.fn().mockReturnValue(actionData),
        },
      ],
      {
        initialEntries: ['/'],
        initialIndex: 0,
      }
    );
    return <RouterProvider router={router} />;
  };

  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
}
