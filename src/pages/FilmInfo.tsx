import '../pages/FilmInfo.css';
import DuneBG from '../assets/Dune2.jpeg';
import Card from 'react-bootstrap/Card';
import { CardActionArea } from '@mui/material';
import { useEffect, useState } from 'react';
import { FilmEV } from '../types/types';
const FilmInfo = () => {
  const [isInitialised, setInit] = useState(false);
  const [result, setResult] = useState<FilmEV>();
  const getFilmData = () => {
    const currentFilm = localStorage.getItem("currentFilm");
    if (currentFilm != null){
      let currentFilmJSON = JSON.parse(currentFilm) as FilmEV;
      setResult(currentFilmJSON);
    }
  }

  useEffect(() => {
    //Runs only on the first render
    getFilmData();
    setInit(true);
  }, [isInitialised]);

    return (
      <div>
        <div className="filmInfo">
          <div className='topSection'>
            {/* <img src={result?.AlternativeImageUri} alt='' className='mainBG'/> */}
          </div>
          <div className='grid gap-10 md:grid-cols-5 lg:gap-10'>
            <div className='midLeft'>
              <Card style={{ width: '18rem' }} className='cards'>
                <CardActionArea href='/booking/cinema'>
                  <Card.Img variant="top" src={result?.ImageUri} />
                  <Card.Body className='cards-body'>
                      <Card.Title className='card-title'>Buy Tickets</Card.Title>
                  </Card.Body>
                </CardActionArea>
                
              </Card>
          </div>
            <div className='midRight col-span-4'>
              <Card style={{ width: '50rem' }} className='cards'>
                  <Card.Body className='cards-body'>
                    <h1>{result?.Title}</h1>
                    <h3>DIRECTORS</h3>
                    {result?.Directors.map((director, index) => (
                        <p key={'director-square-' + index}>{director.Name}, </p>
                    ))}
                    <h3>Writers</h3>
                    {result?.Writers.map((writer, index) => (
                        <p key={'writer-square-' + index}>{writer.Name}, </p>
                    ))}
                    <h3>Actors</h3>
                    {result?.Actors.map((actor, index) => (
                        <p key={'actor-square-' + index}>{actor.Name}, </p>
                    ))}
                    <h3>Description</h3>
                    <p>{result?.Description}</p>
                  </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
    );
}

export default FilmInfo;