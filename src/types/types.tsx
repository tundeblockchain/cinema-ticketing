export type FilmEV = {
    Id: string;
    Title: string;
    Description: string;
    Directors: DirectorEV[];
    Writers: WriterEV[];
    Actors: ActorEV[];
    Year: string;
    uri: string;
    ImageUri: string;
    AlternativeImageUri: string;
};

export type ActorEV = {
    Id: string;
    Name: string;
    Height: string;
    DOB: string;
};

export type DirectorEV = {
    Id: string;
    Name: string;
    Height: string;
    DOB: string;
};

export type WriterEV = {
    Id: string;
    Name: string;
    Height: string;
    DOB: string;
};

export type PlaceEV = {
    Id: string;
    CinemaId: string;
    Name: string;
    City: string;
    Postcode: string;
    Parking: string;
    IMAX: boolean;
    uri: string;
};

export type ScreenTime = {
    Title: string;
    FilmId: string;
    Time: string;
}

export type ScreenEV = {
    Id: string;
    PlaceId: string;
    ScreenNumber: number;
    IMAX: boolean;
    IMAXAudio: boolean;
    DolbyAtmos: boolean;
    Accessibiity: boolean;
    is3D: boolean;
    uri: string;
    ScreenTimes: ScreenTime[];
};

export enum TicketStatus {
    Pending,
    Bought,
    Active,
    Complete,
    Reassigned
}

export type TicketEV = {
    Id: string;
    PlaceId: string;
    CinemaId: string;
    CinemaAddress: string;
    ScreenId: string;
    FilmId: string;
    PlaceName: string;
    title: string;
    Price: number;
    Accessibiity: boolean;
    Seats: string[];
    Type: string;
    uri: string;
    datetime: string;
    Status: TicketStatus;
};

export type CinemaEV = {
    Id: string;
    Name: string;
    CinemaAddress: string;
    uri: string;
};

