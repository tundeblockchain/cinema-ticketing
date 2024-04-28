import { useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import '../seat-allocator/SeatAllocator.css'
import { Button } from 'react-bootstrap';
import { idText } from 'typescript';
const SeatAllocator = ({setSeatsList, setNoOfSeats, setTotalCosts, toggleStages, seats}:
    {setSeatsList:React.Dispatch<React.SetStateAction<string[]>>, setNoOfSeats:React.Dispatch<React.SetStateAction<number>>,
        setTotalCosts: React.Dispatch<React.SetStateAction<number>>, toggleStages: () => void, seats: boolean[]}) => {
    let [initialized, setInitialized] = useState<boolean>(false)
    
    let [seatsIds, setSeatsIds] = useState<string[]>([])
    let [noOfSelectedSeats, setNoOfSelectedSeats] = useState<number>(0)
    let [costOfTickets, setCostOfTickets] = useState<number>(0)
    

    const setTotalTickets = (checked: boolean, id: string) => {
        if (checked){
            // If seat is selected then add £10 worth to cost of tickets and add to total number of seats
            // TO DO - make the price configurable
            setNoOfSelectedSeats(noOfSelectedSeats + 1)
            setCostOfTickets(costOfTickets + 10)
            seatsIds.push(id);
            setSeatsIds(seatsIds);
            setSeatsList(seatsIds);
            setInfo(noOfSelectedSeats + 1, costOfTickets + 10);
        }else{
            // If seat is selected then subtract £10 worth to cost of tickets and subtract from total number of seats
            // TO DO - make the price configurable
            setNoOfSelectedSeats(noOfSelectedSeats - 1)
            setCostOfTickets(costOfTickets - 10)
            setSeatsIds(seatsIds.filter(x => x != id));
            setSeatsList(seatsIds.filter(x => x != id));
            setInfo(noOfSelectedSeats - 1, costOfTickets - 10);
        }
    }

    const setInfo = (noOfSeats: number, costOfTickets: number) => {
        // This sets the number of seats and total costs which are to be used by other components such as the Payment component
        setNoOfSeats(noOfSeats);
        console.log(costOfTickets)
        setTotalCosts(costOfTickets);
    }

    // useEffect(() => {
    //     setInitialized(true);
    // }, [initialized]);

    return(
        <Card sx={{ maxWidth: 1000 }} className='col-start-3 col-span-2 '>
            <CardContent className='card-top'>
                <div className='ticket-selector'>
                    <div className='seats'>
                        <div className='status'>
                            <div className='item'>Available</div>  
                            <div className='item'>Booked</div>   
                            <div className='item'>Selected</div>       
                        </div> 
                        <div className='all-seats'>
                            {seats.map((seat, index) => (
                                <div key={'s' + index + '-' + seat}>
                                    {!seat && <input type='checkbox' name='date' id={'s' + index} onChange={(event) => setTotalTickets(event.target.checked, event.target.id)} />}
                                    <label htmlFor={'s' + index} className={seat ? 'seat booked': 'seat'}></label>
                                </div>
                            ))}
                        </div>     
                    </div>
                    <div className='price'>
                        <div className='total'>
                            <span>
                                <span className='count'>{noOfSelectedSeats}</span> Tickets
                            </span>
                            <div className='amount'>£{costOfTickets}</div>
                        </div>
                        <Button variant="primary" className='btSeating pt-0.5' onClick={toggleStages}>
                            Pay Now
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default SeatAllocator;