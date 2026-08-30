import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { publicProvider } from 'wagmi/providers/public';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const { chains, provider } = configureChains([avalancheFuji], [publicProvider()]);

const client = createClient({
  connectors: [new MetaMaskConnector({ chains })],
  autoConnect: false,
  provider,
});

const queryClient = new QueryClient();

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <WagmiConfig client={client}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </WagmiConfig>
);

test('renders without crashing', () => {
  render(
    <TestWrapper>
      <App />
    </TestWrapper>
  );
});
