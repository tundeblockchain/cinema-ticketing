import { useState, useEffect } from 'react'
import '../pages/BookingCinema.css';
import SelectLocation from '../components/select-location/SelectLocation';
import { Button } from 'react-bootstrap';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import InputLabel from '@mui/material/InputLabel';
import SeatAllocator from '../components/seat-allocator/SeatAllocator';
import Payments from '../components/payments/Payments';
import { Transition } from '@headlessui/react'
import { useContractRead } from 'wagmi';
import CinemaInfoABI from '../abi/CinemaInfo.json'
import CinemaMarketABI from '../abi/CinemaMarket.json'
import { loadCinemas, loadPlaces, loadScreens, loadTickets } from '../load/load';
import { CinemaEV, FilmEV, PlaceEV, ScreenEV, TicketEV, TicketStatus } from '../types/types';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import BeatLoader from 'react-spinners/BeatLoader';
import { DatePicker } from '@mui/x-date-pickers';
import Select, { SingleValue } from 'react-select';

const today = dayjs();

interface SelectOption {
    value: string,
    label: string
  }

const BookingCinema = () => {
    const [isInitialised, setInit] = useState(false);
    const [isPageLoading, setLoading] = useState(true);
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [timeChosen, setTimeChosen] = useState(false);
    const [location, setLocation] = useState('');
    let [currentStage, setStage] = useState<number>(1)
    let [selectedSeats, setSelectedSeats] = useState<string[]>([])
    let [seats, setSeats] = useState<boolean[]>([])
    let [bookedSeats, setBookedSeats] = useState<string[]>([])
    let [filmTimes, setFilmTimes] = useState<SelectOption[]>([])
    let [noOfSelectedSeats, setNoOfSelectedSeats] = useState<number>(0)
    let [costOfTickets, setCostOfTickets] = useState<number>(0)
    const [places, setPlaces] = useState<PlaceEV[]>([]);
    const [cinemas, setCinemas] = useState<CinemaEV[]>([]);
    const [screens, setScreens] = useState<ScreenEV[]>([]);
    let [ticket, setTicket] = useState<TicketEV>()
    const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
    const [seatAllocatedLoad, setSeatAllocated] = useState('loading');

    const { data, isError, isLoading } = useContractRead({
        address: process.env.REACT_APP_CINEMA_INFO_ADDRESS as `0x${string}`,
        abi: CinemaInfoABI.abi,
        functionName: 'getAllPlaces',
        async onSuccess(data) {
            let placesList = await loadPlaces(data as Array<any>);
            setPlaces([...placesList])
            if (ticket != null){
                let placeInfo = placesList.find(x => x.Id == location);
                ticket.PlaceId = placeInfo?.Id ?? '';
                ticket.PlaceName = placeInfo?.Name ?? '';
                ticket.CinemaId = placeInfo?.CinemaId ?? '';
            }
            if(!allScreensResult.isLoading && !allCinemaResult.isLoading)
                setLoading(false)
        }
    })

    const allCinemaResult = useContractRead({
        address: process.env.REACT_APP_CINEMA_INFO_ADDRESS as `0x${string}`,
        abi: CinemaInfoABI.abi,
        functionName: 'getAllCinemas',
        async onSuccess(data) {
            let cinemasList = await loadCinemas(data as Array<any>);
            setCinemas([...cinemasList])

            if(!allScreensResult.isLoading && !isLoading)
                setLoading(false)
        }
    })

    const allScreensResult = useContractRead({
        address: process.env.REACT_APP_CINEMA_INFO_ADDRESS as `0x${string}`,
        abi: CinemaInfoABI.abi,
        functionName: 'getAllScreens',
        async onSuccess(data) {
            let screensList = await loadScreens(data as Array<any>);
            setScreens([...screensList])
            if(!allCinemaResult.isLoading && !isLoading)
                setLoading(false)
        }
    })

    const allTicketsForScreeningResult = useContractRead({
        address: process.env.REACT_APP_CINEMA_MARKET_ADDRESS as `0x${string}`,
        abi: CinemaMarketABI.abi,
        functionName: 'fetchTicketsByScreenId',
        args: [ticket?.ScreenId],
        async onSuccess(data) {
            let ticketsList = await loadTickets(data as Array<any>);
            for(let i = 0; i < ticketsList.length; i++){
                for(let j = 0; j < ticketsList[i].Seats.length; j++){
                    bookedSeats.push(ticketsList[i].Seats[j])
                }
            }
            setupBookedSeats();
            setSeatAllocated('loaded')
        }
    })

    useEffect(() => {
        async function fetchData() {
            // let placesList = await loadPlaces(data as Array<any>);
            // setPlaces([...placesList])

            // let cinemasList = await loadCinemas(allCinemaResult.data as Array<any>);
            // setCinemas([...cinemasList])

            // let screensList = await loadScreens(allScreensResult.data as Array<any>);
            // setScreens([...screensList])

            //let placeInfo = placesList.find(x => x.Id == location);
            let currentFilm = localStorage.getItem('currentFilm') ?? '';
            if (currentFilm != null || currentFilm != ''){
                let currentFilmJSON = JSON.parse(currentFilm) as FilmEV;
                let ticket: TicketEV = {
                    Id: uuidv4(), // Temp ID
                    PlaceId: '',
                    CinemaId: '',
                    CinemaAddress: '',
                    ScreenId: '',
                    FilmId: currentFilmJSON.Id,
                    PlaceName: '',
                    title: currentFilmJSON.Title,
                    Price: costOfTickets,
                    Accessibiity: false,
                    Seats: selectedSeats,
                    Type: 'standard',
                    uri: '',
                    datetime: selectedDate.toJSON(),
                    Status: TicketStatus.Pending
                };
    
                setTicket(ticket)
            } 
            
            setLoading(false);
            setInit(true);
        }
    
        if(!isLoading)
            fetchData()
        //Runs only on the first render
        
      }, [isInitialised]);

    
    const toggleStages = () => {
        if (currentStage < 3)
            setStage(currentStage + 1);
        else
            setStage(1);
    };

    const setDate = (date: dayjs.Dayjs)  => {
        if (ticket != null){
            ticket.datetime = date.toJSON();
            setSelectedDate(date);
        }
    }

    const setTime = (time: SingleValue<SelectOption>)  => {
        if (time !== null){
            let timeVal = time.value;
            let timeArry = timeVal.split(':')
            if (timeArry.length == 2){
                setSelectedDate(selectedDate.set('hours', parseInt(timeArry[0])).set('minute', parseInt(timeArry[1])))
                setTimeChosen(true)
            } 
        }
    }

    const setPlace = (placeId: string) => {
        setLocation(placeId);
        setShowDate(true);
        setShowTime(true);
    }

    const fetchBookedSeats = async () => {
        // find screen for booking
        setLoading(true)
        if (ticket != null){
            let screensForMovie = screens.filter(x => x.ScreenTimes.find(y => y.FilmId == ticket?.FilmId) != null && x.PlaceId == location)
            let screen = screensForMovie.find(x => x.ScreenTimes.find(y => y.Time == selectedDate.format('HH:mm')));
            ticket.ScreenId = screen?.Id ?? '';
            ticket.datetime = selectedDate.toJSON();
            let x = await allTicketsForScreeningResult.refetch()
        }
        
        toggleStages();
        
    }

    const fetchTimes = (placeId: string) => {
        let times = [] as Array<SelectOption>;
        if (ticket != null){
            let screensForMovie = screens.filter(x => x.ScreenTimes.find(y => y.FilmId == ticket?.FilmId) != null && x.PlaceId == placeId)
            screensForMovie.forEach((screen) => {
                screen.ScreenTimes.forEach((element) => times.push({value: element.Time, label: element.Time}));
            });
            setFilmTimes([...times]);
        }
        
    }

    const setupBookedSeats = () => {
        if (seats.length == 0){
            for(let i = 0; i < 59; i++){
                let booked = bookedSeats.find(x => x.includes(i.toString())) !== undefined;
                seats.push(booked);
            }
        }else{
            for(let i = 0; i < 59; i++){
                let booked = bookedSeats.find(x => x.includes(i.toString())) !== undefined;
                seats[i] = booked;
            }
        }
        setLoading(false)
    }

    return(
        <div className='booking-cinema'>
            <div className={isPageLoading ? 'loader' : 'hidden'}>
                <h1>Loading...</h1>
                <BeatLoader color="#36d7b7" loading={isPageLoading} />
            </div>
            <div className={!isPageLoading ? 'grid grid-cols-6' : 'hidden'}>
                <div className='col-start-3 col-span-2'>
                    <Transition
                        className="mx-auto my-16 max-w-md space-y-4"
                        show={currentStage === 1}
                        enter="transition-all ease-in-out duration-500 delay-[200ms]"
                        enterFrom="opacity-0 translate-y-6"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition-all ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <h1 className='col-start-2 col-span-2'>Book Tickets</h1>
                        <Card sx={{ maxWidth: 800 }}>
                            <CardContent>
                                <InputLabel className='dropDownLabel' id="date-time-label">Choose Location</InputLabel>
                                {/* Select Location */}
                                <SelectLocation places={places} location={location} setPlace={setPlace} ticket={ticket} cinemas={cinemas}
                                                fetchTimes={fetchTimes}></SelectLocation>
                                {/* Select Time */}
                                <div className='grid grid-rows-2'>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <div className={showDate ? '' : 'hidden'}>
                                            <InputLabel className={showDate ? 'dropDownLabel pb-0.5' : 'hidden'} id="date-time-label">Choose Date & Time</InputLabel>
                                            <DatePicker className={showDate ? 'date-time-pick' : 'hidden'}
                                                            value={dayjs(selectedDate)} 
                                                            onChange={(e) => { console.log(e); setDate(dayjs(e));}} 
                                                            minDate={today}
                                            />
                                        </div>
                                        
                                        <form className='film-times'>
                                            <Select
                                                className={showTime ? '' : 'hidden'}
                                                onChange={(choice) => setTime(choice)}
                                                options={filmTimes}  
                                            />
                                        </form>
                                        
                                    </LocalizationProvider>
                                    {/* Continue Button */}
                                    <div className={showDate && timeChosen ? 'btSeating pt-0.5' : 'hidden'}>
                                        <Button variant="primary" className='btSeating pt-0.5' onClick={fetchBookedSeats}>
                                            Continue
                                        </Button>
                                    </div>
                                    
                                </div>
                            </CardContent>
                        </Card>
                    </Transition>
                </div>
                
                <div className='col-start-3 col-span-2'>
                    <Transition
                        className="mx-auto my-16 max-w-md space-y-4"
                        show={currentStage === 2 && !isLoading}
                        enter="transition-all ease-in-out duration-500 delay-[200ms]"
                        enterFrom="opacity-0 translate-y-6"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition-all ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <h1 className='col-start-3 col-span-2'>Choose Seats</h1>
                        <SeatAllocator  setSeatsList={setSelectedSeats} setNoOfSeats={setNoOfSelectedSeats} setTotalCosts={setCostOfTickets}
                                                toggleStages={toggleStages} seats={seats}></SeatAllocator>
                    </Transition>
                </div>

                <div className='col-start-3 col-span-2'>
                    <Transition
                        className="mx-auto my-16 max-w-md space-y-4"
                        show={currentStage === 3}
                        enter="transition-all ease-in-out duration-500 delay-[200ms]"
                        enterFrom="opacity-0 translate-y-6"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition-all ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <h1 className='col-start-3 col-span-2'>Payment</h1>
                        <Card sx={{ maxWidth: 500 }} className='col-start-3 col-span-2 card-top'>
                            <CardContent className='card-background' >
                                <Payments seats={selectedSeats} noOfSelectedSeats={noOfSelectedSeats} costOfTickets={costOfTickets}
                                            toggleStages={toggleStages} ticket={ticket}></Payments>                  
                            </CardContent>
                        </Card>
                    </Transition>
                </div> 
            </div>
        </div>
    )
}

export default BookingCinema;