import axios from "axios";
import { DirectorEV, FilmEV, PlaceEV, WriterEV, CinemaEV, TicketEV, ScreenEV, ScreenTime, TicketStatus } from "../types/types";

export const loadFilms = async (filmResults: Array<any>) => {
    let films: Array<FilmEV> = [];
    
    for(let i = 0; i <= filmResults.length; i++){
        let element = filmResults[i];
        if (element != null){
            let filmEV: FilmEV = {
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
                let response = await axios.get(filmEV.uri);
                let filmInfo = response.data;
                filmEV.Year = filmInfo.Year;
                filmEV.ImageUri = filmInfo.ImageUri;
                filmEV.Description = filmInfo.Description;
                filmEV.AlternativeImageUri = filmInfo.AlternativeImageUri;

                // Load Directors
                for(let i = 0; i < filmInfo.Directors.length; i++){
                  let director: DirectorEV = {
                    Id: filmInfo.Directors[i].DirectorId,
                    Name: filmInfo.Directors[i].Name,
                    Height: filmInfo.Directors[i].Height,
                    DOB: filmInfo.Directors[i].DOB
                  }
                  filmEV.Directors.push(director);
                }
      
                // Load Writers
                for(let i = 0; i < filmInfo.Writers.length; i++){
                  let writer: WriterEV = {
                    Id: filmInfo.Writers[i].DirectorId,
                    Name: filmInfo.Writers[i].Name,
                    Height: filmInfo.Writers[i].Height,
                    DOB: filmInfo.Writers[i].DOB
                  }
                  filmEV.Writers.push(writer);
                }
      
                // Load Actors
                for(let i = 0; i < filmInfo.Actors.length; i++){
                  let actor: WriterEV = {
                    Id: filmInfo.Actors[i].ActorId,
                    Name: filmInfo.Actors[i].Name,
                    Height: filmInfo.Actors[i].Height,
                    DOB: filmInfo.Actors[i].DOB
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

export const loadPlaces = async (placeResults: Array<any>) => {
    let places: Array<PlaceEV> = [];

    for(let i = 0; i <= placeResults.length; i++){
        let element = placeResults[i];
        if (element != null){
            let placeEV: PlaceEV = {
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
                let response = await axios.get(placeEV.uri);
                let placeInfo = response.data;
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

export const loadScreens = async (screenResults: Array<any>) => {
  let screens: Array<ScreenEV> = [];
  for(let i = 0; i <= screenResults.length; i++){
      let element = screenResults[i];
      if (element != null){
          let screenEV: ScreenEV = {
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
                let response = await axios.get(screenEV.uri);
                let screenInfo = response.data;
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

export const loadCinemas = async (cinemaResults: Array<any>) => {
  let cinemas: Array<CinemaEV> = [];

  for(let i = 0; i <= cinemaResults.length; i++){
      let element = cinemaResults[i];
      if (element != null){
          let cinemaEV: CinemaEV = {
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

export const loadTickets = async (ticketsResults: Array<any>) => {
  let tickets: Array<TicketEV> = [];
  console.log(ticketsResults)
  for(let i = 0; i <= ticketsResults.length; i++){
      let element = ticketsResults[i];
      if (element != null){
          let ticketEV: TicketEV = {
              Id: element.itemID,
              PlaceId: element.PlaceId,
              CinemaId: element.CinemaId,
              CinemaAddress: '',
              ScreenId: element.ScreenId,
              FilmId: element.FilmId,
              PlaceName: '',
              Price: 0,
              Accessibiity: false,
              Seats: [],
              Type: '',
              title: '',
              datetime: '',
              uri: element.uri,
              Status: TicketStatus.Pending
          }

          if (ticketEV.uri != null && ticketEV.uri != ''){
            try{
              let response = await axios.get(ticketEV.uri);
              let ticketInfo = response.data;
              ticketEV.CinemaId = ticketInfo.CinemaId;
              ticketEV.CinemaAddress = ticketInfo.CinemaAddress;
              ticketEV.ScreenId = ticketInfo.ScreenId;
              ticketEV.FilmId = ticketInfo.FilmId;
              ticketEV.PlaceName = ticketInfo.PlaceName;
              ticketEV.Price = ticketInfo.Price;
              ticketEV.Accessibiity = ticketInfo.Accessibiity;
              ticketEV.Type = ticketInfo.Type;
              ticketEV.Seats = ticketInfo.Seats;
              ticketEV.title = ticketInfo.title;
              ticketEV.datetime = ticketInfo.datetime;
              ticketEV.Status = <TicketStatus>ticketInfo.Status;
              tickets.push(ticketEV)
            }catch(err){
              console.log(err)
            }
            
        }
          
      }
      
  }
  return tickets;
}