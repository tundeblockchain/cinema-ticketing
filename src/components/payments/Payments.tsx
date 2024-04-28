import { useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import '../payments/Payments.css';
import { Button } from 'react-bootstrap';
import { TicketEV } from '../../types/types';
import { create as ipfsHttpClient} from 'ipfs-http-client';
import dayjs from 'dayjs';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import CinemaMarketABI from '../../abi/CinemaMarket.json'
import erc20ABI from '../../abi/erc20.json'
import toast from 'react-hot-toast';
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';
import { BigNumber } from 'ethers';
const Payments = ({seats, noOfSelectedSeats, costOfTickets, toggleStages, ticket}: {seats: string[], noOfSelectedSeats:number, costOfTickets: number, 
    toggleStages: () => void, ticket: TicketEV | undefined}) => {
        const [hasEnoughAllowance, setHasEnoughAllowance] = useState(false);
        const [isInitialised, setInit] = useState(false);
        const { isConnected, address } = useAccount()
        let navigate = useNavigate(); 
    
    useEffect(() => {
        async function uploadData() {
            await uploadToIpfs();
            setInit(true);
        }
    
        if(!isLoading)
            uploadData()
    
    }, [isInitialised]);
        

    // Check Allowance
    const checkAllowance = useContractRead({
        address: process.env.REACT_APP_USDC_ADDRESS as `0x${string}`,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [address, process.env.REACT_APP_CINEMA_MARKET_ADDRESS],
        onSuccess(data) {
            let bn = BigNumber.from(data);
            let allowance = bn.toNumber() / (10 ** 6)
            let price =  costOfTickets;
            if (price <= allowance){
                setHasEnoughAllowance(true)
                refetch()
            }else{
                setHasEnoughAllowance(false)
            }
        }
    })

    // Prepare Approval Transaction
    const approvePrepareTx = usePrepareContractWrite({
        address: process.env.REACT_APP_USDC_ADDRESS as `0x${string}`,
        abi: erc20ABI,
        functionName: "approve",
        args: [process.env.REACT_APP_CINEMA_MARKET_ADDRESS, 10000000],
        enabled: true,
        onSuccess(data) {
            console.log('Successfully prepared approval')
        },
        onError(error) {
            toast.dismiss()
            toast.error('Transaction Failed')
            console.log('Error', error)
        },
      });
    

      // Prepare Create Ticket Transaction
    const { config, refetch } = usePrepareContractWrite({
        address: process.env.REACT_APP_CINEMA_MARKET_ADDRESS as `0x${string}`,
        abi: CinemaMarketABI.abi,
        functionName: 'createTicket',
        args: [ticket?.CinemaAddress, ticket?.title, ticket?.uri, ticket?.Price, ticket?.ScreenId],
        enabled: true,
        onSuccess(data) {
            console.log('Successfully prepared createTicket')
        },
        onError(error) {
            console.log(ticket)
            console.log('failed creatTicket')
            console.log('Error', error)
        },
    })

    const approveTx = useContractWrite(approvePrepareTx.config)
    const { data, isLoading, isSuccess, write } = useContractWrite(config)

    // Wait for Approval Transaction
    const { isLoading: waitApproveLoading } = useWaitForTransaction({ 
        hash: approveTx.data?.hash,
        onSuccess: () => {
          setHasEnoughAllowance(true);
          toast.dismiss();
          toast.success('Approval Completed');
          refetch();
        },
        onError:()=>toast.error("An Error Occurred")
      })

      // Wait for Create Ticket Transaction
      const { isLoading: waitCreateLoading } = useWaitForTransaction({ 
        hash: data?.hash,
        onSuccess:()=>{
          toast.dismiss();
          toast.success('Ticket Created Successfully');
          navigate('/')
        },
        onError:()=>toast.error("An Error Occurred")
      })
    
    const approve = () => {
        // initiate blockchain payment
        if(approveTx.write){
            toast.loading('Approving...');
            approveTx.write();
        }else{
            console.log('Approval not ready')
        }
    }

    const uploadToIpfs = async () => {
        if (ticket != null)
            ticket.Seats = seats;

        let ticketJson = JSON.stringify(ticket);

        try {
            // Add ticket info to ipfs
            const auth = 'Basic ' + Buffer.from(process.env.REACT_APP_IPFS_PROJECTID + ':' + process.env.REACT_APP_IPFS_SECRET).toString('base64');

            const client = ipfsHttpClient({
                host: process.env.REACT_APP_IPFS_HOST,
                port: 5001,
                protocol: 'https',
                headers: {
                    authorization: auth,
                },
            });

            const added = await client.add(ticketJson);
            const url = process.env.REACT_APP_IPFS_DEDICATED_GATEWAY + added.path;
            
            if (ticket != null){
                ticket.uri = url;
                ticket.Price = costOfTickets;
            }
            console.log(ticket)
        }catch(err){
            console.log(err)
        }
    }

    const completePayment = async () => {
        try {
            // initiate blockchain payment
            if(write){
                toast.loading('Buying Ticket...');
                write();
            }else{
                console.log('Create Ticket not ready')
            }
        }catch(err){
            console.log(err)
        }
    }
    return(
        <Card sx={{ maxWidth: 1000 }} className='col-start-3 col-span-2'>
            <CardContent className=''>
                <div className='ticket-selector'>
                    <h2>Place: {ticket?.PlaceName}</h2>
                    <h3>Date: { dayjs(ticket?.datetime).format('DD-MM-YYYY')}</h3>
                    <h3>Time: { dayjs(ticket?.datetime).format('HH:mm')}</h3>
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
                        {/* Only allow user to pay for tickets if they have enough allow */}
                        {hasEnoughAllowance && 
                            <Button variant="primary" className='btSeating pt-0.5' onClick={completePayment}>
                            Pay Now
                            </Button>
                        }
                        {/* If user does not have enough allowance display the approval button */}
                        {!hasEnoughAllowance &&
                            <Button variant="primary" className='btSeating pt-0.5' onClick={approve}>
                                Approve
                            </Button>
                        }
                        
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default Payments;