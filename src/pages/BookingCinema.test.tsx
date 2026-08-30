import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '../test/test-utils';
import userEvent from '@testing-library/user-event';
import BookingCinema from './BookingCinema';

let mockAllPlacesData: unknown[] | undefined = undefined;
let mockAllPlacesLoading = true;
let mockAllCinemasData: unknown[] | undefined = undefined;
let mockAllCinemasLoading = true;
let mockAllScreensData: unknown[] | undefined = undefined;
let mockAllScreensLoading = true;
let mockTicketsData: unknown[] | undefined = undefined;
let mockTicketsLoading = false;
let mockRefetch = vi.fn().mockResolvedValue({ data: [] });

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();
  return {
    ...actual,
    useReadContract: ({ functionName }: { functionName: string }) => {
      if (functionName === 'getAllPlaces') {
        return {
          data: mockAllPlacesData,
          isLoading: mockAllPlacesLoading,
        };
      }
      if (functionName === 'getAllCinemas') {
        return {
          data: mockAllCinemasData,
          isLoading: mockAllCinemasLoading,
        };
      }
      if (functionName === 'getAllScreens') {
        return {
          data: mockAllScreensData,
          isLoading: mockAllScreensLoading,
        };
      }
      if (functionName === 'fetchTicketsByScreenId') {
        return {
          data: mockTicketsData,
          isLoading: mockTicketsLoading,
          refetch: mockRefetch,
        };
      }
      return {
        data: undefined,
        isLoading: false,
      };
    },
    useAccount: () => ({
      isConnected: true,
      address: '0x1234567890abcdef1234567890abcdef12345678' as `0x${string}`,
    }),
    useWriteContract: () => ({
      writeContract: vi.fn(),
      data: undefined,
      isPending: false,
    }),
    useWaitForTransactionReceipt: () => ({
      isLoading: false,
      isSuccess: false,
      isError: false,
    }),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
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

vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockImplementation((url: string) => {
      if (url.includes('place')) {
        return Promise.resolve({
          data: {
            CinemaId: 'cinema-1',
            Name: 'Vue Leicester Square',
            City: 'London',
            Postcode: 'WC2H 7NA',
            Parking: 'NCP nearby',
            IMAX: true,
          },
        });
      }
      if (url.includes('screen')) {
        return Promise.resolve({
          data: {
            ScreenNumber: 1,
            IMAX: true,
            IMAXAudio: true,
            DolbyAtmos: true,
            Accessibiity: true,
            is3D: true,
            ScreenTimes: [{ Title: 'Inception', FilmId: 'film-1', Time: '19:30' }],
          },
        });
      }
      return Promise.resolve({ data: {} });
    }),
  },
}));

const mockFilm = {
  Id: 'film-1',
  Title: 'Inception',
  Description: 'A mind-bending thriller',
  Directors: [],
  Writers: [],
  Actors: [],
  Year: '2010',
  uri: 'https://ipfs.io/film/1',
  ImageUri: 'https://ipfs.io/image/1.jpg',
  AlternativeImageUri: '',
};

describe('BookingCinema', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAllPlacesData = undefined;
    mockAllPlacesLoading = true;
    mockAllCinemasData = undefined;
    mockAllCinemasLoading = true;
    mockAllScreensData = undefined;
    mockAllScreensLoading = true;
    mockTicketsData = undefined;
    mockTicketsLoading = false;
    mockRefetch = vi.fn().mockResolvedValue({ data: [] });
    
    localStorage.setItem('currentFilm', JSON.stringify(mockFilm));
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Loading State', () => {
    it('shows loading indicator while data is loading', () => {
      render(<BookingCinema />, { withRouter: true });
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('shows BeatLoader spinner while loading', () => {
      render(<BookingCinema />, { withRouter: true });
      
      const loader = document.querySelector('.loader');
      expect(loader).toBeInTheDocument();
    });
  });

  describe('Stage 1 - Location Selection', () => {
    beforeEach(() => {
      mockAllPlacesLoading = false;
      mockAllCinemasLoading = false;
      mockAllScreensLoading = false;
      mockAllPlacesData = [
        { itemID: 'place-1', uri: 'https://ipfs.io/place/1' },
        { itemID: 'place-2', uri: 'https://ipfs.io/place/2' },
      ];
      mockAllCinemasData = [
        { itemID: 'cinema-1', name: 'Vue', cinemaAddress: '0xCinema1', uri: 'https://ipfs.io/cinema/1' },
      ];
      mockAllScreensData = [
        { itemID: 'screen-1', placeId: 'place-1', uri: 'https://ipfs.io/screen/1' },
      ];
    });

    it('displays Book Tickets heading', async () => {
      render(<BookingCinema />, { withRouter: true });
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /book tickets/i })).toBeInTheDocument();
      });
    });

    it('displays Choose Location label', async () => {
      render(<BookingCinema />, { withRouter: true });
      
      await waitFor(() => {
        expect(screen.getByText(/choose location/i)).toBeInTheDocument();
      });
    });

    it('hides date/time selectors initially', async () => {
      render(<BookingCinema />, { withRouter: true });
      
      await waitFor(() => {
        const dateLabel = screen.queryByText(/choose date & time/i);
        expect(dateLabel).toBeInTheDocument();
      });
      
      const dateTimeLabel = screen.getByText(/choose date & time/i);
      expect(dateTimeLabel.closest('.hidden')).toBeInTheDocument();
    });
  });

  describe('Stage Transitions', () => {
    beforeEach(() => {
      mockAllPlacesLoading = false;
      mockAllCinemasLoading = false;
      mockAllScreensLoading = false;
      mockAllPlacesData = [
        { itemID: 'place-1', uri: 'https://ipfs.io/place/1' },
      ];
      mockAllCinemasData = [
        { itemID: 'cinema-1', name: 'Vue', cinemaAddress: '0xCinema1', uri: 'https://ipfs.io/cinema/1' },
      ];
      mockAllScreensData = [
        { itemID: 'screen-1', placeId: 'place-1', uri: 'https://ipfs.io/screen/1' },
      ];
    });

    it('starts at stage 1 (location selection)', async () => {
      render(<BookingCinema />, { withRouter: true });
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /book tickets/i })).toBeInTheDocument();
      });
    });
  });

  describe('Component Structure', () => {
    beforeEach(() => {
      mockAllPlacesLoading = false;
      mockAllCinemasLoading = false;
      mockAllScreensLoading = false;
      mockAllPlacesData = [];
      mockAllCinemasData = [];
      mockAllScreensData = [];
    });

    it('renders grid layout', async () => {
      render(<BookingCinema />, { withRouter: true });
      
      await waitFor(() => {
        const gridContainer = document.querySelector('.grid');
        expect(gridContainer).toBeInTheDocument();
      });
    });

    it('has correct CSS class', async () => {
      render(<BookingCinema />, { withRouter: true });
      
      await waitFor(() => {
        const bookingCinema = document.querySelector('.booking-cinema');
        expect(bookingCinema).toBeInTheDocument();
      });
    });
  });
});

describe('BookingCinema - No Current Film', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAllPlacesLoading = false;
    mockAllCinemasLoading = false;
    mockAllScreensLoading = false;
    mockAllPlacesData = [];
    mockAllCinemasData = [];
    mockAllScreensData = [];
    localStorage.clear();
  });

  it('handles missing currentFilm in localStorage gracefully', async () => {
    localStorage.setItem('currentFilm', '');
    render(<BookingCinema />, { withRouter: true });
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /book tickets/i })).toBeInTheDocument();
    });
  });
});
