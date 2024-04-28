import HomeCarousel from "../components/home-carousel/Home-Carousel";
import TopFilms from "../components/top-films/TopFilms";
import CinemaInfoABI from '../abi/CinemaInfo.json'
import { useContractRead} from 'wagmi'
import BeatLoader from "react-spinners/BeatLoader";
import { useEffect, useState } from 'react';
import { FilmEV } from "../types/types";
import { loadFilms } from "../load/load";

function Home() {
  const [isInitialised, setInit] = useState(false);
  const [isPageLoading, setLoading] = useState(true);
  const [result, setResult] = useState<FilmEV[]>([]);
  const { data, isError, isLoading } = useContractRead({
    address: process.env.REACT_APP_CINEMA_INFO_ADDRESS as `0x${string}`,
    abi: CinemaInfoABI.abi,
    functionName: 'getAllFilms',
    async onSuccess(data) {
      let films = await loadFilms(data as Array<any>);
      console.log(films)
      setResult([...films])
      setLoading(false);
    }
  })

  useEffect(() => {
    async function fetchData() {
      setLoading(false);
      setInit(true);
    }

    fetchData()
    //Runs only on the first render
    
  }, [isInitialised]);

    return (
        <div className="container">
            <div >
              <div className={isPageLoading ? 'loader' : 'hidden'}>
                <BeatLoader color="#36d7b7" loading={isPageLoading} />
              </div>
              <HomeCarousel loading={isPageLoading}></HomeCarousel>
              <TopFilms films={result} loading={isPageLoading}></TopFilms> 
            </div>
        </div>
    );
  }

  export default Home;