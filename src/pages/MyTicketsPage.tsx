import { Card } from 'react-bootstrap';
import { CardActionArea } from '@mui/material';
import '../pages/MyTicketsPage.css'
import Header from '../components/header/Header';
import MyTickets from '../components/my-tickets/MyTickets';
import { useAccount, useContractRead} from 'wagmi';
import CinemaMarketABI from '../abi/CinemaMarket.json'
import { BeatLoader } from 'react-spinners';
import { useEffect, useState } from 'react';
import { loadTickets } from '../load/load';
import { TicketEV } from '../types/types';

const MyTicketsPage = () => {
    const [isInitialised, setInit] = useState(false);
    const [tickets, setTickets] = useState<TicketEV[]>([]);
    const { address } = useAccount()
    const { data, isError, isLoading } = useContractRead({
        address: process.env.REACT_APP_CINEMA_MARKET_ADDRESS as `0x${string}`,
        abi: CinemaMarketABI.abi,
        functionName: 'fetchTicketsForOwner', // This will fetch all the tickets owned by the connected address
        args: [address],
        async onSuccess(data) {
            let ticketsList = await loadTickets(data as Array<any>);
            setTickets([...ticketsList])
            console.log(ticketsList)
        }
    })

    useEffect(() => {
        //Runs only on the first render
        async function fetchData() {
            let ticketsList = await loadTickets(data as Array<any>);
            setTickets([...ticketsList])
            setInit(true);
        }
    
        if(!isLoading)
            fetchData()
      }, [isInitialised]);
    
    return (
        <div>
            <div className={isLoading ? 'loader' : 'hidden'}>
                <h1>Loading...</h1>
                <BeatLoader color="#36d7b7" loading={isLoading} />
            </div>
            {/* Display ticket owned by user */}
            <MyTickets loading={isLoading} tickets={tickets}></MyTickets>
        </div>
    )
}

export default MyTicketsPage;