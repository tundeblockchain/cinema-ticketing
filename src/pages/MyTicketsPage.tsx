import '../pages/MyTicketsPage.css';
import MyTickets from '../components/my-tickets/MyTickets';
import { useAccount, useReadContract } from 'wagmi';
import CinemaMarketABI from '../abi/CinemaMarket.json';
import { BeatLoader } from 'react-spinners';
import { useEffect, useState } from 'react';
import { loadTickets } from '../load/load';
import { TicketEV } from '../types/types';

const MyTicketsPage = () => {
  const [isInitialised, setInit] = useState(false);
  const [tickets, setTickets] = useState<TicketEV[]>([]);
  const { address } = useAccount();
  
  const { data, isLoading } = useReadContract({
    address: import.meta.env.VITE_CINEMA_MARKET_ADDRESS as `0x${string}`,
    abi: CinemaMarketABI.abi,
    functionName: 'fetchTicketsForOwner',
    args: [address],
  });

  useEffect(() => {
    async function fetchData() {
      if (data) {
        const ticketsList = await loadTickets(data as Array<unknown>);
        setTickets([...ticketsList]);
        console.log(ticketsList);
      }
      setInit(true);
    }

    if (!isLoading) {
      fetchData();
    }
  }, [data, isLoading, isInitialised]);

  return (
    <div>
      <div className={isLoading ? 'loader' : 'hidden'}>
        <h1>Loading...</h1>
        <BeatLoader color="#36d7b7" loading={isLoading} />
      </div>
      <MyTickets loading={isLoading} tickets={tickets}></MyTickets>
    </div>
  );
};

export default MyTicketsPage;
