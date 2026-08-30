import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import Header from './Header';

const mockConnect = vi.fn();
const mockDisconnect = vi.fn();
let mockIsConnected = false;
let mockAddress: `0x${string}` | undefined = undefined;

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();
  return {
    ...actual,
    useConnect: () => ({
      connectors: [{ id: 'mock-connector', name: 'Mock Wallet' }],
      connect: mockConnect,
    }),
    useDisconnect: () => ({
      disconnect: mockDisconnect,
    }),
    useAccount: () => ({
      isConnected: mockIsConnected,
      address: mockAddress,
    }),
  };
});

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsConnected = false;
    mockAddress = undefined;
  });

  it('renders navigation links', () => {
    render(<Header />);
    
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /films/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /my tickets/i })).toBeInTheDocument();
  });

  it('renders logo image', () => {
    render(<Header />);
    
    const logo = document.querySelector('.logo');
    expect(logo).toBeInTheDocument();
  });

  it('sets document title on mount', () => {
    render(<Header />);
    
    expect(document.title).toBe('Cinema Ticketing');
  });

  it('renders exactly one Connect button when disconnected', () => {
    render(<Header />);
    
    const connectButtons = screen.getAllByRole('button', { name: /connect/i });
    expect(connectButtons).toHaveLength(1);
  });
});

describe('Header - Disconnected State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsConnected = false;
    mockAddress = undefined;
  });

  it('shows Connect button when wallet is disconnected', () => {
    render(<Header />);
    
    const connectButton = screen.getByRole('button', { name: /connect/i });
    expect(connectButton).toBeInTheDocument();
  });

  it('does not show Disconnect button when wallet is disconnected', () => {
    render(<Header />);
    
    const disconnectButton = screen.queryByRole('button', { name: /disconnect/i });
    expect(disconnectButton).not.toBeInTheDocument();
  });

  it('does not show account address when wallet is disconnected', () => {
    render(<Header />);
    
    const addressElement = document.querySelector('.account-address');
    expect(addressElement).not.toBeInTheDocument();
  });

  it('calls connect when Connect button is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    
    const connectButton = screen.getByRole('button', { name: /connect/i });
    await user.click(connectButton);
    
    expect(mockConnect).toHaveBeenCalledWith({ connector: { id: 'mock-connector', name: 'Mock Wallet' } });
  });
});

describe('Header - Connected State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsConnected = true;
    mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
  });

  it('shows Disconnect button when wallet is connected', () => {
    render(<Header />);
    
    const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
    expect(disconnectButton).toBeInTheDocument();
  });

  it('does not show Connect button when wallet is connected', () => {
    render(<Header />);
    
    const connectButton = screen.queryByRole('button', { name: /^connect$/i });
    expect(connectButton).not.toBeInTheDocument();
  });

  it('displays truncated wallet address when connected', () => {
    render(<Header />);
    
    const addressElement = screen.getByText('0x1234...5678');
    expect(addressElement).toBeInTheDocument();
  });

  it('calls disconnect when Disconnect button is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    
    const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
    await user.click(disconnectButton);
    
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
