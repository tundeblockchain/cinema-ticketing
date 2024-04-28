import { Card } from 'react-bootstrap';
import QRCode from "react-qr-code";
import '../my-tickets/MyTickets.css'
import { TicketEV } from '../../types/types';
import dayjs from 'dayjs';

const MyTickets = ({loading, tickets}:{loading:boolean, tickets: TicketEV[]}) => {
    return (
        <div className={loading? 'hidden' : ''}>
            <div>{tickets.length == 0 && 
                    <div className='no-tickets'>
                        <h1>You have no tickets!</h1>
                    </div>
                }
                
                <ul>
                    {tickets.map((ticket, index) => (
                        <li key={'film-square-' + index}>
                            <Card style={{ width: '18rem' }} className=''>
                                <div className='ticket-selector'>
                                    <h2>{ticket.title}</h2>
                                    <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
                                        {/* Displays a barcode used to scan for entry */}
                                        <QRCode
                                            size={256}
                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                            value={ticket.Id}
                                            viewBox={`0 0 256 256`}
                                        />
                                    </div>
                                    <h3>{ticket.PlaceName}</h3>
                                    <h3>Date: {ticket.datetime != '' ? dayjs(ticket.datetime).format('DD-MM-YYYY') : ''}</h3>
                                    <h3>Time: {ticket.datetime != '' ? dayjs(ticket.datetime).format('HH:mm') : ''}</h3>
                                    <h4>Ticket Type: {ticket.Type}</h4>
                                    <div className='all-seats'>
                                        <h5>Seats</h5>
                                        {/* Loops through each ticket and displays the seat number */}
                                        {ticket.Seats.map((seat, index) => (
                                            <div key={'s' + index}>
                                                <h5>{seat.toUpperCase()}, </h5>
                                            </div>
                                        ))}
                                    </div>    
                                    <div className='price-payments'>
                                        <div className='total-payments'>
                                            {/* Displays the total cost of tickets and total number amount of tickets */}
                                            <span>
                                                <span className='count'>{ticket.Seats.length}</span> Tickets
                                            </span>
                                            <div className='amount'>£{ticket.Price}</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default MyTickets;