import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '../../test/test-utils';
import MyTickets from './MyTickets';
import { TicketEV, TicketStatus } from '../../types/types';

vi.mock('react-qr-code', () => ({
  default: ({ value }: { value: string }) => (
    <div data-testid="qr-code" data-value={value}>QR Code</div>
  ),
}));

const createMockTicket = (overrides: Partial<TicketEV> = {}): TicketEV => ({
  Id: 'ticket-123',
  PlaceId: 'place-1',
  CinemaId: 'cinema-1',
  CinemaAddress: '0x1234567890abcdef1234567890abcdef12345678',
  ScreenId: 'screen-1',
  FilmId: 'film-1',
  PlaceName: 'Vue Leicester Square',
  title: 'Inception',
  Price: BigInt(20000000),
  Accessibiity: false,
  Seats: ['A1', 'A2'],
  Type: 'standard',
  uri: 'ipfs://QmHash123',
  datetime: '2024-12-25T19:30:00.000Z',
  Status: TicketStatus.Bought,
  ...overrides,
});

describe('MyTickets', () => {
  describe('Loading State', () => {
    it('hides content when loading is true', () => {
      render(<MyTickets loading={true} tickets={[]} />);
      
      const ticketsContainer = document.querySelector('.hidden');
      expect(ticketsContainer).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays no tickets message when tickets array is empty', () => {
      render(<MyTickets loading={false} tickets={[]} />);
      
      expect(screen.getByRole('heading', { name: /my tickets/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /you have no tickets/i })).toBeInTheDocument();
    });
  });

  describe('With Tickets', () => {
    it('displays ticket title', () => {
      const ticket = createMockTicket({ title: 'The Matrix' });
      render(<MyTickets loading={false} tickets={[ticket]} />);
      
      expect(screen.getByRole('heading', { name: /the matrix/i })).toBeInTheDocument();
    });

    it('displays ticket place name', () => {
      const ticket = createMockTicket({ PlaceName: 'Odeon Leicester Square' });
      render(<MyTickets loading={false} tickets={[ticket]} />);
      
      expect(screen.getByRole('heading', { name: /odeon leicester square/i })).toBeInTheDocument();
    });

    it('displays formatted date', () => {
      const ticket = createMockTicket({ datetime: '2024-06-15T14:00:00.000Z' });
      render(<MyTickets loading={false} tickets={[ticket]} />);
      
      expect(screen.getByText(/date:/i)).toBeInTheDocument();
      expect(screen.getByText(/15-06-2024/i)).toBeInTheDocument();
    });

    it('displays formatted time', () => {
      const ticket = createMockTicket({ datetime: '2024-06-15T14:30:00.000Z' });
      render(<MyTickets loading={false} tickets={[ticket]} />);
      
      expect(screen.getByText(/time:/i)).toBeInTheDocument();
      expect(screen.getByText(/14:30/i)).toBeInTheDocument();
    });

    it('displays ticket type', () => {
      const ticket = createMockTicket({ Type: 'VIP' });
      render(<MyTickets loading={false} tickets={[ticket]} />);
      
      expect(screen.getByText(/ticket type:/i)).toBeInTheDocument();
      expect(screen.getByText(/vip/i)).toBeInTheDocument();
    });

    it('displays all seats', () => {
      const ticket = createMockTicket({ Seats: ['B3', 'B4', 'B5'] });
      render(<MyTickets loading={false} tickets={[ticket]} />);
      
      expect(screen.getByText(/b3/i)).toBeInTheDocument();
      expect(screen.getByText(/b4/i)).toBeInTheDocument();
      expect(screen.getByText(/b5/i)).toBeInTheDocument();
    });

    it('displays ticket count', () => {
      const ticket = createMockTicket({ Seats: ['C1', 'C2'] });
      render(<MyTickets loading={false} tickets={[ticket]} />);
      
      const countElement = document.querySelector('.count');
      expect(countElement).toHaveTextContent('2');
    });

    it('displays price in pounds (converted from USDC)', () => {
      const ticket = createMockTicket({ Price: BigInt(25000000) });
      render(<MyTickets loading={false} tickets={[ticket]} />);
      
      expect(screen.getByText(/£25/)).toBeInTheDocument();
    });

    it('displays QR code with ticket ID', () => {
      const ticket = createMockTicket({ Id: 'unique-ticket-id-456' });
      render(<MyTickets loading={false} tickets={[ticket]} />);
      
      const qrCode = screen.getByTestId('qr-code');
      expect(qrCode).toHaveAttribute('data-value', 'unique-ticket-id-456');
    });

    it('renders multiple tickets', () => {
      const tickets = [
        createMockTicket({ Id: 'ticket-1', title: 'Movie One' }),
        createMockTicket({ Id: 'ticket-2', title: 'Movie Two' }),
        createMockTicket({ Id: 'ticket-3', title: 'Movie Three' }),
      ];
      render(<MyTickets loading={false} tickets={tickets} />);
      
      expect(screen.getByRole('heading', { name: /movie one/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /movie two/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /movie three/i })).toBeInTheDocument();
    });

    it('handles empty datetime gracefully', () => {
      const ticket = createMockTicket({ datetime: '' });
      render(<MyTickets loading={false} tickets={[ticket]} />);
      
      const dateElements = screen.getAllByRole('heading', { level: 3 });
      const dateElement = dateElements.find(el => el.textContent?.includes('Date:'));
      expect(dateElement?.textContent).toBe('Date: ');
    });
  });
});
