import { Card } from 'react-bootstrap';
import { CardActionArea } from '@mui/material';
import '../films-grid/FilmsGrid.css'
import { useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';
import { FilmEV } from '../../types/types';
import CinemaInfoABI from '../../abi/CinemaInfo.json'
import { loadFilms } from '../../load/load';
import { BeatLoader } from 'react-spinners';
import { useNavigate } from "react-router-dom";
const FilmsGrid = () => {
    const [isInitialised, setInit] = useState(false);
    const [result, setResult] = useState<FilmEV[]>([]);
    const [isPageLoading, setLoading] = useState(true);
    let navigate = useNavigate(); 
    const { data, isError, isLoading } = useContractRead({
        address: process.env.REACT_APP_CINEMA_INFO_ADDRESS as `0x${string}`,
        abi: CinemaInfoABI.abi,
        functionName: 'getAllFilms',
    })

    useEffect(() => {
        async function fetchData() {
          let films = await loadFilms(data as Array<any>);
          setResult([...films])
          setLoading(false);
          setInit(true);
        }
    
        fetchData()
        //Runs only on the first render
        
      }, [isInitialised]);

    const routeChange = (film: FilmEV) =>{ 
        // navigates to the film Info screen with the selected film.
        let path = `../filminfo`; 
        localStorage.setItem("currentFilm", JSON.stringify(film))
        navigate(path);
    }

    return (
        <div>
            <div>
                <div className={isLoading ? 'loading-box' : 'hidden'}>
                    <h1>Loading...</h1>
                    <BeatLoader color="#36d7b7" loading={isLoading} />
                </div>
                <div className={isLoading? 'hidden' : 'grid grid-cols-4 gap-4'}>
                    {result.map((film, index) => (
                        <div key={'film-square-' + index}>
                            <Card style={{ width: '18rem' }} className='cards'>
                                <CardActionArea onClick={() => routeChange(film)}>
                                    <Card.Img variant="top" src={film.ImageUri} />
                                </CardActionArea>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FilmsGrid;