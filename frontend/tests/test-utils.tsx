import { render, renderHook, RenderOptions } from '@testing-library/react';
import { AppStore, RootState, setupStore } from '../src/store';
import { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import {
  createMemoryRouter,
  LoaderFunction,
  RouterProvider,
} from 'react-router-dom';
import { ActionResponse } from '../src/types/store/ActionTypes.ts';
import { Theme } from '@radix-ui/themes';
import ModalProvider from '../src/components/shared/modal/ModalProvider.tsx';
import { UnknownAction } from '@reduxjs/toolkit';
import { GetUsersType } from '../src/types/api/UserTypes.ts';
import { Mock } from 'vitest';

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
    wrapper: ExternalWrapper,
    ...renderOptions
  } = extendedRenderOptions;

  const Wrapper = ({ children }: PropsWithChildren) =>
    ExternalWrapper ? (
      <Theme>
        <ExternalWrapper>
          <Provider store={store}>{children}</Provider>
        </ExternalWrapper>
      </Theme>
    ) : (
      <Theme>
        <Provider store={store}>{children}</Provider>
      </Theme>
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
    wrapper: ExternalWrapper,
    ...renderOptions
  } = extendedRenderOptions;

  const Wrapper = ({ children }: PropsWithChildren) =>
    ExternalWrapper ? (
      <Theme>
        <ExternalWrapper>
          <Provider store={store}>{children}</Provider>
        </ExternalWrapper>
      </Theme>
    ) : (
      <Theme>
        <Provider store={store}>{children}</Provider>
      </Theme>
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

interface QueryResult {
  unwrap: () => Promise<GetUsersType>;
  unsubscribe: () => void;
}

export function setupStoreDispatchMock(
  mockUnwrap: Mock,
  mockUnsubscribe: Mock
) {
  const store = setupStore();

  const originalDispatch = store.dispatch;
  const spyDispatch = vi
    .spyOn(store, 'dispatch')
    .mockImplementation((action: UnknownAction) => {
      const result = originalDispatch(action);

      const hasQueryMethods = (obj: unknown): obj is QueryResult => {
        return (
          obj !== null &&
          typeof obj === 'object' &&
          'unwrap' in obj &&
          'unsubscribe' in obj &&
          typeof (obj as QueryResult).unwrap === 'function' &&
          typeof (obj as QueryResult).unsubscribe === 'function'
        );
      };

      if (hasQueryMethods(result)) {
        result.unwrap = mockUnwrap;
        result.unsubscribe = mockUnsubscribe;
      }

      return result;
    });

  return { store, dispatch: spyDispatch };
}
