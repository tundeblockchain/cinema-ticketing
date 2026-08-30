import '../pages/FilmInfo.css';
import Card from 'react-bootstrap/Card';
import { CardActionArea } from '@mui/material';
import { useEffect, useState } from 'react';
import { FilmEV } from '../types/types';

const FilmInfo = () => {
  const [isInitialised, setInit] = useState(false);
  const [result, setResult] = useState<FilmEV>();

  const getFilmData = () => {
    const currentFilm = localStorage.getItem('currentFilm');
    if (currentFilm != null) {
      const currentFilmJSON = JSON.parse(currentFilm) as FilmEV;
      setResult(currentFilmJSON);
    }
  };

  useEffect(() => {
    getFilmData();
    setInit(true);
  }, [isInitialised]);

  return (
    <div className="filmInfo">
      <div className='film-layout'>
        <div className='midLeft'>
          <Card className='cards'>
            <CardActionArea href='/booking/cinema'>
              <Card.Img variant="top" src={result?.ImageUri} />
              <Card.Body className='cards-body'>
                <Card.Title className='card-title'>Buy Tickets</Card.Title>
              </Card.Body>
            </CardActionArea>
          </Card>
        </div>
        <div className='midRight'>
          <Card className='cards'>
            <Card.Body className='cards-body'>
              <h1>{result?.Title}</h1>
              <div className='film-meta-section'>
                <h3>Directors</h3>
                {result?.Directors.map((director, index) => (
                  <p key={'director-square-' + index}>
                    {director.Name}{index < (result?.Directors.length || 1) - 1 ? ', ' : ''}
                  </p>
                ))}
              </div>
              <div className='film-meta-section'>
                <h3>Writers</h3>
                {result?.Writers.map((writer, index) => (
                  <p key={'writer-square-' + index}>
                    {writer.Name}{index < (result?.Writers.length || 1) - 1 ? ', ' : ''}
                  </p>
                ))}
              </div>
              <div className='film-meta-section'>
                <h3>Actors</h3>
                {result?.Actors.map((actor, index) => (
                  <p key={'actor-square-' + index}>
                    {actor.Name}{index < (result?.Actors.length || 1) - 1 ? ', ' : ''}
                  </p>
                ))}
              </div>
              <div className='film-meta-section'>
                <h3>Description</h3>
                <p>{result?.Description}</p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FilmInfo;
