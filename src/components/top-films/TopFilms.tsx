import Card from 'react-bootstrap/Card';
import { CardActionArea } from '@mui/material';
import './TopFilms.css'
import { FilmEV } from '../../types/types';
import { useNavigate } from "react-router-dom";

const TopFilms = ({films, loading}:{films: FilmEV[], loading:boolean}) => {
    let navigate = useNavigate(); 
    const routeChange = (film: FilmEV) =>{ 
        let path = `filminfo`; 
        localStorage.setItem("currentFilm", JSON.stringify(film))
        navigate(path);
    }

    return (
        <div className={loading ? 'hidden' : 'topFilms'}>
            <h1 className='title'>Top Films</h1>
            <div className='topFilmsCards'>
                {films.map((film, index) => (
                    <Card style={{ width: '18rem' }} className='cards' key={'topfilm-square-' + index}>
                        <CardActionArea onClick={() => routeChange(film)}>
                            <Card.Img variant="top" src={film.ImageUri} />
                            <Card.Body className='cards-body'>
                                <Card.Title className='card-title'>{film.Title}</Card.Title>
                            </Card.Body>
                        </CardActionArea>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default TopFilms;