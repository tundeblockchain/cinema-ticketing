import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import '../payments/Payments.css';
import { Button } from 'react-bootstrap';
import { TicketEV } from '../../types/types';
import dayjs from 'dayjs';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import CinemaMarketABI from '../../abi/CinemaMarket.json';
import erc20ABI from '../../abi/erc20.json';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { PinataSDK } from 'pinata-web3';

const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: import.meta.env.VITE_IPFS_DEDICATED_GATEWAY,
});

const Payments = ({
  seats,
  noOfSelectedSeats,
  costOfTickets,
  toggleStages,
  ticket,
}: {
  seats: string[];
  noOfSelectedSeats: number;
  costOfTickets: number;
  toggleStages: () => void;
  ticket: TicketEV | undefined;
}) => {
  const [hasEnoughAllowance, setHasEnoughAllowance] = useState(false);
  const [isInitialised, setInit] = useState(false);
  const [ticketWithUri, setTicketWithUri] = useState<TicketEV | undefined>(ticket);
  const { isConnected, address } = useAccount();
  const navigate = useNavigate();

  const { writeContract: writeApprove, data: approveHash, isPending: isApprovePending } = useWriteContract();
  const { writeContract: writeCreateTicket, data: createTicketHash, isPending: isCreatePending } = useWriteContract();

  const checkAllowance = useReadContract({
    address: import.meta.env.VITE_USDC_ADDRESS as `0x${string}`,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address, import.meta.env.VITE_CINEMA_MARKET_ADDRESS],
    query: {
      enabled: !!address,
    },
  });

  const waitApprove = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const waitCreateTicket = useWaitForTransactionReceipt({
    hash: createTicketHash,
  });

  useEffect(() => {
    if (checkAllowance.data !== undefined) {
      const allowance = Number(checkAllowance.data) / 10 ** 6;
      const price = costOfTickets;
      if (price <= allowance) {
        setHasEnoughAllowance(true);
      } else {
        setHasEnoughAllowance(false);
      }
    }
  }, [checkAllowance.data, costOfTickets]);

  useEffect(() => {
    async function uploadData() {
      await uploadToIpfs();
      setInit(true);
    }

    if (!checkAllowance.isLoading && !isInitialised) {
      uploadData();
    }
  }, [checkAllowance.isLoading, isInitialised]);

  useEffect(() => {
    if (waitApprove.isSuccess) {
      setHasEnoughAllowance(true);
      toast.dismiss();
      toast.success('Approval Completed');
      checkAllowance.refetch();
    }
    if (waitApprove.isError) {
      toast.dismiss();
      toast.error('An Error Occurred');
    }
  }, [waitApprove.isSuccess, waitApprove.isError]);

  useEffect(() => {
    if (waitCreateTicket.isSuccess) {
      toast.dismiss();
      toast.success('Ticket Created Successfully');
      navigate('/');
    }
    if (waitCreateTicket.isError) {
      toast.dismiss();
      toast.error('An Error Occurred');
    }
  }, [waitCreateTicket.isSuccess, waitCreateTicket.isError, navigate]);

  const approve = () => {
    toast.loading('Approving...');
    writeApprove({
      address: import.meta.env.VITE_USDC_ADDRESS as `0x${string}`,
      abi: erc20ABI,
      functionName: 'approve',
      args: [import.meta.env.VITE_CINEMA_MARKET_ADDRESS, BigInt(10000000)],
    });
  };

  const uploadToIpfs = async () => {
    if (ticket != null) {
      ticket.Seats = seats;
    }

    const ticketJson = JSON.stringify(ticket, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );

    try {
      const file = new File([ticketJson], ticket?.Id + '.json', { type: 'text/plain' });
      const upload = await pinata.upload.file(file);
      const url = 'https://' + import.meta.env.VITE_IPFS_DEDICATED_GATEWAY + '/ipfs/' + upload.IpfsHash;

      if (ticket != null) {
        const updatedTicket = { ...ticket, uri: url, Price: BigInt(costOfTickets * 10 ** 6) };
        setTicketWithUri(updatedTicket);
      }
      console.log(ticket);
    } catch (err) {
      console.log(err);
    }
  };

  const completePayment = async () => {
    try {
      const currentTicket = ticketWithUri || ticket;
      if (currentTicket) {
        toast.loading('Buying Ticket...');
        writeCreateTicket({
          address: import.meta.env.VITE_CINEMA_MARKET_ADDRESS as `0x${string}`,
          abi: CinemaMarketABI.abi,
          functionName: 'createTicket',
          args: [
            currentTicket.CinemaAddress,
            currentTicket.title,
            currentTicket.uri,
            currentTicket.Price,
            currentTicket.ScreenId,
          ],
        });
      } else {
        console.log('Create Ticket not ready');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card sx={{ maxWidth: 1000 }} className='col-start-3 col-span-2'>
      <CardContent className=''>
        <div className='ticket-selector'>
          <h2>Place: {ticket?.PlaceName}</h2>
          <h3>Date: {dayjs(ticket?.datetime).format('DD-MM-YYYY')}</h3>
          <h3>Time: {dayjs(ticket?.datetime).format('HH:mm')}</h3>
          <div className='all-seats'>
            <h4>Seats</h4>
            {seats.map((seat, index) => (
              <div key={'s' + index}>
                <h4>{seat.toUpperCase()}, </h4>
              </div>
            ))}
          </div>
          <div className='price-payments'>
            <div className='total-payments'>
              <span>
                <span className='count'>{noOfSelectedSeats}</span> Tickets
              </span>
              <div className='amount'>£{costOfTickets}</div>
            </div>
            {hasEnoughAllowance && (
              <Button
                variant="primary"
                className='btSeating pt-0.5'
                onClick={completePayment}
                disabled={isCreatePending || waitCreateTicket.isLoading}
              >
                Pay Now
              </Button>
            )}
            {!hasEnoughAllowance && (
              <Button
                variant="primary"
                className='btSeating pt-0.5'
                onClick={approve}
                disabled={isApprovePending || waitApprove.isLoading}
              >
                Approve
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Payments;
