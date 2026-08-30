import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import SeatAllocator from './SeatAllocator';

const createDefaultProps = () => ({
  setSeatsList: vi.fn(),
  setNoOfSeats: vi.fn(),
  setTotalCosts: vi.fn(),
  toggleStages: vi.fn(),
  seats: Array(59).fill(false),
});

const getAllSeatCheckboxes = (container: HTMLElement) => 
  container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');

describe('SeatAllocator', () => {
  describe('Initial Render', () => {
    it('displays seat status indicators', () => {
      const props = createDefaultProps();
      render(<SeatAllocator {...props} />);
      
      expect(screen.getByText(/available/i)).toBeInTheDocument();
      expect(screen.getByText(/booked/i)).toBeInTheDocument();
      expect(screen.getByText(/selected/i)).toBeInTheDocument();
    });

    it('displays initial ticket count as 0', () => {
      const props = createDefaultProps();
      render(<SeatAllocator {...props} />);
      
      const countElement = document.querySelector('.count');
      expect(countElement).toHaveTextContent('0');
    });

    it('displays initial cost as £0', () => {
      const props = createDefaultProps();
      render(<SeatAllocator {...props} />);
      
      expect(screen.getByText(/£0/)).toBeInTheDocument();
    });

    it('renders Pay Now button', () => {
      const props = createDefaultProps();
      render(<SeatAllocator {...props} />);
      
      expect(screen.getByRole('button', { name: /pay now/i })).toBeInTheDocument();
    });

    it('renders all available seats as checkboxes', () => {
      const props = createDefaultProps();
      const { container } = render(<SeatAllocator {...props} />);
      
      const checkboxes = getAllSeatCheckboxes(container);
      expect(checkboxes.length).toBe(59);
    });
  });

  describe('Booked Seats', () => {
    it('does not render checkboxes for booked seats', () => {
      const seats = Array(59).fill(false);
      seats[0] = true;
      seats[5] = true;
      seats[10] = true;
      
      const props = { ...createDefaultProps(), seats };
      const { container } = render(<SeatAllocator {...props} />);
      
      const checkboxes = getAllSeatCheckboxes(container);
      expect(checkboxes.length).toBe(56);
    });

    it('displays booked seats with booked class', () => {
      const seats = Array(59).fill(false);
      seats[0] = true;
      
      const props = { ...createDefaultProps(), seats };
      render(<SeatAllocator {...props} />);
      
      const bookedSeatLabel = document.querySelector('.seat.booked');
      expect(bookedSeatLabel).toBeInTheDocument();
    });
  });

  describe('Seat Selection', () => {
    it('increments ticket count when seat is selected', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      const { container } = render(<SeatAllocator {...props} />);
      
      const checkboxes = getAllSeatCheckboxes(container);
      await user.click(checkboxes[0]);
      
      const countElement = document.querySelector('.count');
      expect(countElement).toHaveTextContent('1');
    });

    it('increments cost by £10 when seat is selected', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      const { container } = render(<SeatAllocator {...props} />);
      
      const checkboxes = getAllSeatCheckboxes(container);
      await user.click(checkboxes[0]);
      
      expect(screen.getByText(/£10/)).toBeInTheDocument();
    });

    it('calls setSeatsList with seat ID when selected', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      const { container } = render(<SeatAllocator {...props} />);
      
      const checkboxes = getAllSeatCheckboxes(container);
      await user.click(checkboxes[0]);
      
      expect(props.setSeatsList).toHaveBeenCalled();
    });

    it('calls setNoOfSeats when seat is selected', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      const { container } = render(<SeatAllocator {...props} />);
      
      const checkboxes = getAllSeatCheckboxes(container);
      await user.click(checkboxes[0]);
      
      expect(props.setNoOfSeats).toHaveBeenCalledWith(1);
    });

    it('calls setTotalCosts with updated cost when seat is selected', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      const { container } = render(<SeatAllocator {...props} />);
      
      const checkboxes = getAllSeatCheckboxes(container);
      await user.click(checkboxes[0]);
      
      expect(props.setTotalCosts).toHaveBeenCalledWith(10);
    });

    it('handles multiple seat selection', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      const { container } = render(<SeatAllocator {...props} />);
      
      const checkboxes = getAllSeatCheckboxes(container);
      await user.click(checkboxes[0]);
      await user.click(checkboxes[1]);
      await user.click(checkboxes[2]);
      
      const countElement = document.querySelector('.count');
      expect(countElement).toHaveTextContent('3');
      expect(screen.getByText(/£30/)).toBeInTheDocument();
    });
  });

  describe('Seat Deselection', () => {
    it('decrements ticket count when seat is deselected', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      const { container } = render(<SeatAllocator {...props} />);
      
      const checkboxes = getAllSeatCheckboxes(container);
      await user.click(checkboxes[0]);
      await user.click(checkboxes[1]);
      await user.click(checkboxes[0]);
      
      const countElement = document.querySelector('.count');
      expect(countElement).toHaveTextContent('1');
    });

    it('decrements cost by £10 when seat is deselected', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      const { container } = render(<SeatAllocator {...props} />);
      
      const checkboxes = getAllSeatCheckboxes(container);
      await user.click(checkboxes[0]);
      await user.click(checkboxes[1]);
      await user.click(checkboxes[0]);
      
      expect(screen.getByText(/£10/)).toBeInTheDocument();
    });

    it('removes seat from list when deselected', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      const { container } = render(<SeatAllocator {...props} />);
      
      const checkboxes = getAllSeatCheckboxes(container);
      await user.click(checkboxes[0]);
      await user.click(checkboxes[0]);
      
      expect(props.setNoOfSeats).toHaveBeenLastCalledWith(0);
      expect(props.setTotalCosts).toHaveBeenLastCalledWith(0);
    });
  });

  describe('Pay Now Button', () => {
    it('calls toggleStages when Pay Now is clicked', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      render(<SeatAllocator {...props} />);
      
      const payButton = screen.getByRole('button', { name: /pay now/i });
      await user.click(payButton);
      
      expect(props.toggleStages).toHaveBeenCalled();
    });

    it('can proceed to payment with seats selected', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();
      const { container } = render(<SeatAllocator {...props} />);
      
      const checkboxes = getAllSeatCheckboxes(container);
      await user.click(checkboxes[0]);
      await user.click(checkboxes[1]);
      
      const payButton = screen.getByRole('button', { name: /pay now/i });
      await user.click(payButton);
      
      expect(props.toggleStages).toHaveBeenCalled();
      expect(props.setNoOfSeats).toHaveBeenLastCalledWith(2);
      expect(props.setTotalCosts).toHaveBeenLastCalledWith(20);
    });
  });
});
