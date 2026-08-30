import { Card } from 'react-bootstrap';
import { CardActionArea } from '@mui/material';
import '../films-grid/FilmsGrid.css';
import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { FilmEV } from '../../types/types';
import CinemaInfoABI from '../../abi/CinemaInfo.json';
import { loadFilms } from '../../load/load';
import { BeatLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

const FilmsGrid = () => {
  const [isInitialised, setInit] = useState(false);
  const [result, setResult] = useState<FilmEV[]>([]);
  const [isPageLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const { data, isLoading } = useReadContract({
    address: import.meta.env.VITE_CINEMA_INFO_ADDRESS as `0x${string}`,
    abi: CinemaInfoABI.abi,
    functionName: 'getAllFilms',
  });

  useEffect(() => {
    async function fetchData() {
      if (data) {
        const films = await loadFilms(data as Array<unknown>);
        setResult([...films]);
      }
      setLoading(false);
      setInit(true);
    }

    if (!isLoading) {
      fetchData();
    }
  }, [data, isLoading, isInitialised]);

  const routeChange = (film: FilmEV) => {
    const path = `../filminfo`;
    localStorage.setItem('currentFilm', JSON.stringify(film));
    navigate(path);
  };

  return (
    <div className="films-grid">
      <div>
        <div className={isLoading ? 'loading-box' : 'hidden'}>
          <h1>Loading...</h1>
          <BeatLoader color="#6366f1" loading={isLoading} />
        </div>
        <div className={isLoading ? 'hidden' : 'grid'}>
          {result.map((film, index) => (
            <div key={'film-square-' + index}>
              <Card className='cards'>
                <CardActionArea onClick={() => routeChange(film)}>
                  <Card.Img variant="top" src={film.ImageUri} />
                </CardActionArea>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilmsGrid;
