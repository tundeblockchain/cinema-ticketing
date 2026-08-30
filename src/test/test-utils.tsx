import { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { WagmiProvider, http, createConfig } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

const config = createConfig({
  chains: [avalancheFuji],
  connectors: [],
  transports: {
    [avalancheFuji.id]: http(),
  },
});

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

interface WrapperProps {
  children: ReactNode;
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRouterEntries?: string[];
  withRouter?: boolean;
}

function AllTheProviders({ children }: WrapperProps) {
  const queryClient = createTestQueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function AllTheProvidersWithRouter({ children }: WrapperProps) {
  const queryClient = createTestQueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function createMemoryRouterWrapper(initialEntries: string[]) {
  return function MemoryRouterWrapper({ children }: WrapperProps) {
    const queryClient = createTestQueryClient();
    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
        </QueryClientProvider>
      </WagmiProvider>
    );
  };
}

const customRender = (
  ui: React.ReactElement,
  options?: CustomRenderOptions
) => {
  const { initialRouterEntries, withRouter, ...renderOptions } = options ?? {};
  
  let wrapper;
  if (initialRouterEntries) {
    wrapper = createMemoryRouterWrapper(initialRouterEntries);
  } else if (withRouter) {
    wrapper = AllTheProvidersWithRouter;
  } else {
    wrapper = AllTheProviders;
  }
  
  return render(ui, { wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { customRender as render };
