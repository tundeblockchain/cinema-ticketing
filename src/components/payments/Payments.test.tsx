import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import Payments from './Payments';
import { TicketEV, TicketStatus } from '../../types/types';

const mockWriteApprove = vi.fn();
const mockWriteCreateTicket = vi.fn();
const mockNavigate = vi.fn();
let mockIsConnected = true;
let mockAddress: `0x${string}` | undefined = '0x1234567890abcdef1234567890abcdef12345678';
let mockAllowanceData: bigint | undefined = BigInt(0);
let mockAllowanceLoading = false;
let mockApproveHash: `0x${string}` | undefined;
let mockCreateTicketHash: `0x${string}` | undefined;
let mockApprovePending = false;
let mockCreatePending = false;
let mockApproveSuccess = false;
let mockApproveError = false;
let mockCreateSuccess = false;
let mockCreateError = false;
let mockApproveWaitLoading = false;
let mockCreateWaitLoading = false;
let mockRefetchAllowance = vi.fn().mockResolvedValue({ data: BigInt(0) });

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();
  return {
    ...actual,
    useAccount: () => ({
      isConnected: mockIsConnected,
      address: mockAddress,
    }),
    useReadContract: () => ({
      data: mockAllowanceData,
      isLoading: mockAllowanceLoading,
      refetch: mockRefetchAllowance,
    }),
    useWriteContract: () => {
      const currentMock = mockApproveHash === undefined ? mockWriteApprove : mockWriteCreateTicket;
      const isPending = mockApproveHash === undefined ? mockApprovePending : mockCreatePending;
      const data = mockApproveHash === undefined ? mockApproveHash : mockCreateTicketHash;
      return {
        writeContract: currentMock,
        data,
        isPending,
      };
    },
    useWaitForTransactionReceipt: ({ hash }: { hash?: `0x${string}` }) => {
      if (hash === mockApproveHash) {
        return {
          isLoading: mockApproveWaitLoading,
          isSuccess: mockApproveSuccess,
          isError: mockApproveError,
        };
      }
      return {
        isLoading: mockCreateWaitLoading,
        isSuccess: mockCreateSuccess,
        isError: mockCreateError,
      };
    },
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('pinata-web3', () => ({
  PinataSDK: vi.fn().mockImplementation(() => ({
    upload: {
      file: vi.fn().mockResolvedValue({
        IpfsHash: 'QmTestHash123456789',
      }),
    },
  })),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    loading: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    dismiss: vi.fn(),
  },
}));

const createMockTicket = (overrides: Partial<TicketEV> = {}): TicketEV => ({
  Id: 'ticket-123',
  PlaceId: 'place-1',
  CinemaId: 'cinema-1',
  CinemaAddress: '0xCinemaAddress1234567890abcdef12345678',
  ScreenId: 'screen-1',
  FilmId: 'film-1',
  PlaceName: 'Vue Leicester Square',
  title: 'Inception',
  Price: BigInt(20000000),
  Accessibiity: false,
  Seats: ['A1', 'A2'],
  Type: 'standard',
  uri: '',
  datetime: '2024-12-25T19:30:00.000Z',
  Status: TicketStatus.Pending,
  ...overrides,
});

describe('Payments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsConnected = true;
    mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
    mockAllowanceData = BigInt(0);
    mockAllowanceLoading = false;
    mockApproveHash = undefined;
    mockCreateTicketHash = undefined;
    mockApprovePending = false;
    mockCreatePending = false;
    mockApproveSuccess = false;
    mockApproveError = false;
    mockCreateSuccess = false;
    mockCreateError = false;
    mockApproveWaitLoading = false;
    mockCreateWaitLoading = false;
    mockRefetchAllowance = vi.fn().mockResolvedValue({ data: BigInt(0) });
  });

  const defaultProps = {
    seats: ['A1', 'A2'],
    noOfSelectedSeats: 2,
    costOfTickets: 20,
    toggleStages: vi.fn(),
    ticket: createMockTicket(),
  };

  describe('Display', () => {
    it('displays place name', () => {
      render(<Payments {...defaultProps} />, { withRouter: true });
      
      expect(screen.getByRole('heading', { name: /vue leicester square/i })).toBeInTheDocument();
    });

    it('displays formatted date', () => {
      render(<Payments {...defaultProps} />, { withRouter: true });
      
      expect(screen.getByText(/25-12-2024/i)).toBeInTheDocument();
    });

    it('displays formatted time', () => {
      render(<Payments {...defaultProps} />, { withRouter: true });
      
      expect(screen.getByText(/19:30/i)).toBeInTheDocument();
    });

    it('displays all selected seats', () => {
      render(<Payments {...defaultProps} />, { withRouter: true });
      
      expect(screen.getByText(/a1/i)).toBeInTheDocument();
      expect(screen.getByText(/a2/i)).toBeInTheDocument();
    });

    it('displays ticket count', () => {
      render(<Payments {...defaultProps} />, { withRouter: true });
      
      const countElement = document.querySelector('.count');
      expect(countElement).toHaveTextContent('2');
    });

    it('displays total cost', () => {
      render(<Payments {...defaultProps} />, { withRouter: true });
      
      expect(screen.getByText(/£20/)).toBeInTheDocument();
    });
  });

  describe('Approval Flow', () => {
    it('shows Approve button when allowance is insufficient', () => {
      mockAllowanceData = BigInt(0);
      render(<Payments {...defaultProps} />, { withRouter: true });
      
      expect(screen.getByRole('button', { name: /approve/i })).toBeInTheDocument();
    });

    it('does not show Pay Now button when allowance is insufficient', () => {
      mockAllowanceData = BigInt(0);
      render(<Payments {...defaultProps} />, { withRouter: true });
      
      expect(screen.queryByRole('button', { name: /pay now/i })).not.toBeInTheDocument();
    });
  });

  describe('Payment Flow', () => {
    it('shows Pay Now button when allowance is sufficient', async () => {
      mockAllowanceData = BigInt(100000000);
      render(<Payments {...defaultProps} />, { withRouter: true });
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /pay now/i })).toBeInTheDocument();
      });
    });

    it('does not show Approve button when allowance is sufficient', async () => {
      mockAllowanceData = BigInt(100000000);
      render(<Payments {...defaultProps} />, { withRouter: true });
      
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /approve/i })).not.toBeInTheDocument();
      });
    });
  });

  describe('Multiple Seats Display', () => {
    it('displays all seats with separators', () => {
      const props = {
        ...defaultProps,
        seats: ['B1', 'B2', 'B3', 'B4'],
        noOfSelectedSeats: 4,
        costOfTickets: 40,
      };
      render(<Payments {...props} />, { withRouter: true });
      
      expect(screen.getByText(/b1/i)).toBeInTheDocument();
      expect(screen.getByText(/b2/i)).toBeInTheDocument();
      expect(screen.getByText(/b3/i)).toBeInTheDocument();
      expect(screen.getByText(/b4/i)).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('disables Approve button when approval is pending', () => {
      mockApprovePending = true;
      mockAllowanceData = BigInt(0);
      render(<Payments {...defaultProps} />, { withRouter: true });
      
      const approveButton = screen.getByRole('button', { name: /approve/i });
      expect(approveButton).toBeDisabled();
    });
  });
});
