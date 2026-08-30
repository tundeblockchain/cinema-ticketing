import HomeCarousel from "../components/home-carousel/Home-Carousel";
import TopFilms from "../components/top-films/TopFilms";
import CinemaInfoABI from '../abi/CinemaInfo.json';
import { useReadContract } from 'wagmi';
import BeatLoader from "react-spinners/BeatLoader";
import { useEffect, useState } from 'react';
import { FilmEV } from "../types/types";
import { loadFilms } from "../load/load";
import './Home.css';

function Home() {
  const [isInitialised, setInit] = useState(false);
  const [isPageLoading, setLoading] = useState(true);
  const [result, setResult] = useState<FilmEV[]>([]);
  
  const { data, isLoading } = useReadContract({
    address: import.meta.env.VITE_CINEMA_INFO_ADDRESS as `0x${string}`,
    abi: CinemaInfoABI.abi,
    functionName: 'getAllFilms',
  });

  useEffect(() => {
    async function fetchData() {
      if (data) {
        const films = await loadFilms(data as Array<unknown>);
        console.log(films);
        setResult([...films]);
      }
      setLoading(false);
      setInit(true);
    }

    if (!isLoading) {
      fetchData();
    }
  }, [data, isLoading, isInitialised]);

  return (
    <div className="container home-page">
      <div>
        <div className={isPageLoading ? 'loader' : 'hidden'}>
          <BeatLoader color="#6366f1" loading={isPageLoading} />
        </div>
        <HomeCarousel loading={isPageLoading}></HomeCarousel>
        <TopFilms films={result} loading={isPageLoading}></TopFilms>
      </div>
    </div>
  );
}

export default Home;
