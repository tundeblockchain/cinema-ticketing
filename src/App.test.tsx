import React from 'react';
import { render } from '@testing-library/react';

jest.mock('wagmi', () => ({
  useContractRead: () => ({ data: undefined, isLoading: false, isError: false }),
  useAccount: () => ({ address: undefined, isConnected: false }),
  useConnect: () => ({ connect: jest.fn(), connectors: [] }),
  useDisconnect: () => ({ disconnect: jest.fn() }),
  useNetwork: () => ({ chain: undefined }),
  useSwitchNetwork: () => ({ switchNetwork: jest.fn() }),
  useBalance: () => ({ data: undefined }),
  useSigner: () => ({ data: undefined }),
  useProvider: () => ({}),
  WagmiConfig: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  createClient: jest.fn(),
  configureChains: () => ({ chains: [], provider: {} }),
}));

jest.mock('wagmi/chains', () => ({
  avalancheFuji: { id: 43113, name: 'Avalanche Fuji' },
}));

jest.mock('wagmi/connectors/metaMask', () => ({
  MetaMaskConnector: jest.fn(),
}));

jest.mock('wagmi/providers/public', () => ({
  publicProvider: () => jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useQuery: () => ({ data: undefined, isLoading: false }),
  useQueryClient: () => ({}),
}));

test('smoke test: React renders', () => {
  const TestComponent = () => <div>Test</div>;
  const { getByText } = render(<TestComponent />);
  expect(getByText('Test')).toBeInTheDocument();
});
