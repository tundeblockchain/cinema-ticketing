import axios from "axios";
import { DirectorEV, FilmEV, PlaceEV, WriterEV, CinemaEV, TicketEV, ScreenEV, ScreenTime, TicketStatus } from "../types/types";

interface FilmResult {
  itemID: string;
  title: string;
  uri: string;
}

interface PlaceResult {
  itemID: string;
  uri: string;
}

interface ScreenResult {
  itemID: string;
  placeId: string;
  uri: string;
}

interface CinemaResult {
  itemID: string;
  name: string;
  cinemaAddress: string;
  uri: string;
}

interface TicketResult {
  itemID: string;
  PlaceId: string;
  CinemaId: string;
  ScreenId: string;
  FilmId: string;
  uri: string;
}

export const loadFilms = async (filmResults: Array<unknown>) => {
    const films: Array<FilmEV> = [];
    
    for(let i = 0; i <= filmResults.length; i++){
        const element = filmResults[i] as FilmResult | undefined;
        if (element != null){
            const filmEV: FilmEV = {
                Id: element.itemID,
                Title: element.title,
                Description: '',
                Directors: [],
                Writers: [],
                Actors: [],
                Year: '',
                ImageUri: '',
                uri: element.uri,
                AlternativeImageUri: ''
            }
    
            if (filmEV.uri != null){
              try{
                const response = await axios.get(filmEV.uri);
                const filmInfo = response.data;
                filmEV.Year = filmInfo.Year;
                filmEV.ImageUri = filmInfo.ImageUri;
                filmEV.Description = filmInfo.Description;
                filmEV.AlternativeImageUri = filmInfo.AlternativeImageUri;

                // Load Directors
                for(let j = 0; j < filmInfo.Directors.length; j++){
                  const director: DirectorEV = {
                    Id: filmInfo.Directors[j].DirectorId,
                    Name: filmInfo.Directors[j].Name,
                    Height: filmInfo.Directors[j].Height,
                    DOB: filmInfo.Directors[j].DOB
                  }
                  filmEV.Directors.push(director);
                }
      
                // Load Writers
                for(let j = 0; j < filmInfo.Writers.length; j++){
                  const writer: WriterEV = {
                    Id: filmInfo.Writers[j].DirectorId,
                    Name: filmInfo.Writers[j].Name,
                    Height: filmInfo.Writers[j].Height,
                    DOB: filmInfo.Writers[j].DOB
                  }
                  filmEV.Writers.push(writer);
                }
      
                // Load Actors
                for(let j = 0; j < filmInfo.Actors.length; j++){
                  const actor: WriterEV = {
                    Id: filmInfo.Actors[j].ActorId,
                    Name: filmInfo.Actors[j].Name,
                    Height: filmInfo.Actors[j].Height,
                    DOB: filmInfo.Actors[j].DOB
                  }
                  filmEV.Actors.push(actor);
                }
              }catch(err){
                console.log(err)
              }
            }

            films.push(filmEV)
        }
        
    }
    return films;
  }

export const loadPlaces = async (placeResults: Array<unknown>) => {
    const places: Array<PlaceEV> = [];

    for(let i = 0; i <= placeResults.length; i++){
        const element = placeResults[i] as PlaceResult | undefined;
        if (element != null){
            const placeEV: PlaceEV = {
                Id: element.itemID,
                CinemaId: '',
                Name: '',
                City: '',
                Postcode: '',
                Parking: '',
                uri: element.uri,
                IMAX: false,
            }

            try{
              if (placeEV.uri != null){
                const response = await axios.get(placeEV.uri);
                const placeInfo = response.data;
                placeEV.CinemaId = placeInfo.CinemaId;
                placeEV.Name = placeInfo.Name;
                placeEV.City = placeInfo.City;
                placeEV.Postcode = placeInfo.Postcode;
                placeEV.Parking = placeInfo.Parking;
                placeEV.IMAX = placeInfo.IMAX;
                console.log(placeInfo)
              }

              places.push(placeEV)
            }catch(err){
              console.log(err)
            }
            
        }
        
    }
    return places;
}

export const loadScreens = async (screenResults: Array<unknown>) => {
  const screens: Array<ScreenEV> = [];
  for(let i = 0; i <= screenResults.length; i++){
      const element = screenResults[i] as ScreenResult | undefined;
      if (element != null){
          const screenEV: ScreenEV = {
              Id: element.itemID,
              PlaceId: element.placeId,
              ScreenNumber: 0,
              IMAX: false,
              IMAXAudio: false,
              DolbyAtmos: false,
              uri: element.uri,
              Accessibiity: false,
              is3D: false,
              ScreenTimes: []
          }

          if (screenEV.uri != null){
              try{
                const response = await axios.get(screenEV.uri);
                const screenInfo = response.data;
                screenEV.ScreenNumber = screenInfo.ScreenNumber;
                screenEV.IMAX = screenInfo.IMAX;
                screenEV.IMAXAudio = screenInfo.IMAXAudio;
                screenEV.DolbyAtmos = screenInfo.DolbyAtmos;
                screenEV.Accessibiity = screenInfo.Accessibiity;
                screenEV.is3D = screenInfo.is3D;
                screenInfo.ScreenTimes.forEach((element: ScreenTime) => {
                  screenEV.ScreenTimes.push(element)
                });
              }catch(err){
                console.log(err)
              }
              
              
          }

          screens.push(screenEV)
      }
      
  }
  return screens;
}

export const loadCinemas = async (cinemaResults: Array<unknown>) => {
  const cinemas: Array<CinemaEV> = [];

  for(let i = 0; i <= cinemaResults.length; i++){
      const element = cinemaResults[i] as CinemaResult | undefined;
      if (element != null){
          const cinemaEV: CinemaEV = {
              Id: element.itemID,
              Name: element.name,
              CinemaAddress: element.cinemaAddress,
              uri: element.uri,
          }

          cinemas.push(cinemaEV)
      }
      
  }
  return cinemas;
}

export const loadTickets = async (ticketsResults: Array<unknown>) => {
  const tickets: Array<TicketEV> = [];
  console.log(ticketsResults)
  for(let i = 0; i <= ticketsResults.length; i++){
      const element = ticketsResults[i] as TicketResult | undefined;
      if (element != null){
          const ticketEV: TicketEV = {
              Id: element.itemID,
              PlaceId: element.PlaceId,
              CinemaId: element.CinemaId,
              CinemaAddress: '',
              ScreenId: element.ScreenId,
              FilmId: element.FilmId,
              PlaceName: '',
              Price: BigInt(0),
              Accessibiity: false,
              Seats: [],
              Type: '',
              title: '',
              datetime: '',
              uri: element.uri,
              Status: TicketStatus.Pending
          }

          if (ticketEV.uri != null && ticketEV.uri !== ''){
            try{
              const response = await axios.get(ticketEV.uri);
              const ticketInfo = response.data;
              ticketEV.CinemaId = ticketInfo.CinemaId;
              ticketEV.CinemaAddress = ticketInfo.CinemaAddress;
              ticketEV.ScreenId = ticketInfo.ScreenId;
              ticketEV.FilmId = ticketInfo.FilmId;
              ticketEV.PlaceName = ticketInfo.PlaceName;
              ticketEV.Price = BigInt(ticketInfo.Price);
              ticketEV.Accessibiity = ticketInfo.Accessibiity;
              ticketEV.Type = ticketInfo.Type;
              ticketEV.Seats = ticketInfo.Seats;
              ticketEV.title = ticketInfo.title;
              ticketEV.datetime = ticketInfo.datetime;
              ticketEV.Status = ticketInfo.Status as TicketStatus;
              tickets.push(ticketEV)
            }catch(err){
              console.log(err)
            }
            
        }
          
      }
      
  }
  return tickets;
}
