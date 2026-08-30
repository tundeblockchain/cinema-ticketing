import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../test/test-utils';
import MyTicketsPage from './MyTicketsPage';

let mockTicketsData: unknown[] | undefined = undefined;
let mockTicketsLoading = true;
let mockAddress: `0x${string}` | undefined = '0x1234567890abcdef1234567890abcdef12345678';

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();
  return {
    ...actual,
    useReadContract: () => ({
      data: mockTicketsData,
      isLoading: mockTicketsLoading,
    }),
    useAccount: () => ({
      address: mockAddress,
    }),
  };
});

vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockImplementation((url: string) => {
      return Promise.resolve({
        data: {
          CinemaId: 'cinema-1',
          CinemaAddress: '0xCinemaAddress',
          ScreenId: 'screen-1',
          FilmId: 'film-1',
          PlaceName: 'Vue Leicester Square',
          Price: '20000000',
          Accessibiity: false,
          Type: 'standard',
          Seats: ['A1', 'A2'],
          title: 'Inception',
          datetime: '2024-12-25T19:30:00.000Z',
          Status: 1,
        },
      });
    }),
  },
}));

vi.mock('react-qr-code', () => ({
  default: ({ value }: { value: string }) => (
    <div data-testid="qr-code" data-value={value}>QR Code</div>
  ),
}));

describe('MyTicketsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTicketsData = undefined;
    mockTicketsLoading = true;
    mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
  });

  describe('Loading State', () => {
    it('shows loading indicator while fetching tickets', () => {
      render(<MyTicketsPage />, { withRouter: true });
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('displays BeatLoader spinner while loading', () => {
      render(<MyTicketsPage />, { withRouter: true });
      
      const loader = document.querySelector('.loader');
      expect(loader).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows no tickets message when user has no tickets', async () => {
      mockTicketsLoading = false;
      mockTicketsData = [];
      
      render(<MyTicketsPage />, { withRouter: true });
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /you have no tickets/i })).toBeInTheDocument();
      });
    });
  });

  describe('With Tickets', () => {
    beforeEach(() => {
      mockTicketsLoading = false;
      mockTicketsData = [
        {
          itemID: 'ticket-1',
          PlaceId: 'place-1',
          CinemaId: 'cinema-1',
          ScreenId: 'screen-1',
          FilmId: 'film-1',
          uri: 'https://ipfs.io/ticket/1',
        },
      ];
    });

    it('displays My Tickets heading', async () => {
      render(<MyTicketsPage />, { withRouter: true });
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /my tickets/i })).toBeInTheDocument();
      });
    });

    it('renders ticket information from IPFS', async () => {
      render(<MyTicketsPage />, { withRouter: true });
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /inception/i })).toBeInTheDocument();
      });
    });

    it('displays place name', async () => {
      render(<MyTicketsPage />, { withRouter: true });
      
      await waitFor(() => {
        expect(screen.getByText(/vue leicester square/i)).toBeInTheDocument();
      });
    });

    it('displays formatted date', async () => {
      render(<MyTicketsPage />, { withRouter: true });
      
      await waitFor(() => {
        expect(screen.getByText(/25-12-2024/i)).toBeInTheDocument();
      });
    });

    it('displays QR code', async () => {
      render(<MyTicketsPage />, { withRouter: true });
      
      await waitFor(() => {
        expect(screen.getByTestId('qr-code')).toBeInTheDocument();
      });
    });
  });

  describe('Page Structure', () => {
    it('has my-tickets-page class', () => {
      render(<MyTicketsPage />, { withRouter: true });
      
      const pageContainer = document.querySelector('.my-tickets-page');
      expect(pageContainer).toBeInTheDocument();
    });
  });

  describe('Wallet Connection', () => {
    it('fetches tickets for connected address', async () => {
      mockAddress = '0xABCDEF1234567890abcdef1234567890abcdef12';
      mockTicketsLoading = false;
      mockTicketsData = [];
      
      render(<MyTicketsPage />, { withRouter: true });
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /my tickets/i })).toBeInTheDocument();
      });
    });
  });
});
