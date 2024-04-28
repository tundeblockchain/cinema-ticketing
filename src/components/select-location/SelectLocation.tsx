import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { CinemaEV, PlaceEV, TicketEV } from '../../types/types';

const SelectLocation = ({places, location, setPlace, ticket, cinemas, fetchTimes}: {places:PlaceEV[], location: string, 
    setPlace: (placeId: string) => void, ticket: TicketEV | undefined, cinemas: CinemaEV[], fetchTimes: (placeId: string) => void}) => {
    const handleChange = (event: SelectChangeEvent) => {
        let placeInfo = places.find(x=> x.Id == event.target.value);
        if (placeInfo != null && ticket != null){
            ticket.PlaceName = placeInfo.Name;
            ticket.CinemaId = placeInfo.CinemaId;
            ticket.PlaceId = event.target.value;

            let chosenCinema = cinemas.find(x => x.Id.trim() == placeInfo?.CinemaId.trim());
            if (chosenCinema != null)
                ticket.CinemaAddress = chosenCinema.CinemaAddress;

            setPlace(event.target.value);
            fetchTimes(event.target.value)
        }
            
    };
    return(
        <div className='select-location'>
            <FormControl sx={{ m: 1, minWidth: 120}}>
                <InputLabel className='dropDownLabel' id="demo-simple-select-helper-label">Location</InputLabel>
                <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={location}
                label="Location"
                onChange={handleChange}
                sx={{ background: 'white',color: 'black'}}
                >
                    {/* <MenuItem value="None">
                        <em>None</em>
                    </MenuItem> */}
                    {places.map((place, index) => (
                        <MenuItem value={place.Id} key={'sl-place-' + index}>{place.Name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}

export default SelectLocation;