import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import Header from './Header';

const mockConnect = vi.fn();
const mockDisconnect = vi.fn();
let mockIsConnected = false;

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
      address: mockIsConnected ? '0x1234567890abcdef1234567890abcdef12345678' as `0x${string}` : undefined,
    }),
  };
});

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsConnected = false;
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
});

describe('Header - Disconnected State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsConnected = false;
  });

  it('shows Connect button when wallet is disconnected', () => {
    render(<Header />);
    
    const searchBox = document.querySelector('.search-box:not(.hidden)');
    expect(searchBox).toBeInTheDocument();
    const connectButton = within(searchBox as HTMLElement).getByRole('button', { name: /connect/i });
    expect(connectButton).toBeInTheDocument();
  });

  it('hides Disconnect button when wallet is disconnected', () => {
    render(<Header />);
    
    const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
    expect(disconnectButton).toHaveClass('hidden');
  });

  it('calls connect when Connect button is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    
    const searchBox = document.querySelector('.search-box:not(.hidden)');
    const connectButton = within(searchBox as HTMLElement).getByRole('button', { name: /connect/i });
    await user.click(connectButton);
    
    expect(mockConnect).toHaveBeenCalledWith({ connector: { id: 'mock-connector', name: 'Mock Wallet' } });
  });
});

describe('Header - Connected State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsConnected = true;
  });

  it('shows Disconnect button when wallet is connected', () => {
    render(<Header />);
    
    const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
    expect(disconnectButton).not.toHaveClass('hidden');
  });

  it('hides Connect button container when wallet is connected', () => {
    render(<Header />);
    
    const connectContainer = document.querySelector('.hidden');
    expect(connectContainer).toBeInTheDocument();
    
    const connectButton = within(connectContainer as HTMLElement).getByRole('button', { name: /connect/i });
    expect(connectButton).toBeInTheDocument();
  });

  it('calls disconnect when Disconnect button is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    
    const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
    await user.click(disconnectButton);
    
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
