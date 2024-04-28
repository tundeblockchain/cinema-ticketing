import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import FilmInfo from './pages/FilmInfo';
import BookingCinema from './pages/BookingCinema';
import Films from './pages/Films';
import MyTicketsPage from './pages/MyTicketsPage';
import { WagmiConfig, createClient, configureChains,   } from 'wagmi'
import { avalancheFuji } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public";
import toast, { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from './components/header/Header';

const metadata = {
    name: 'Cinema-Ticketing',
    description: 'My Cinema Ticketing website',
    url: '', // url must match your domain & subdomain
    icons: []
}

  const { chains, provider  } = configureChains([avalancheFuji], [
    publicProvider(),
  ]);
  document.title = 'Cinema Ticketing';
const client = createClient({
  autoConnect: true,
  provider,
});
const queryClient = new QueryClient()
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <WagmiConfig client={client}>
    <QueryClientProvider client={queryClient}>
      <link href='https://fonts.googleapis.com/css?family=Abel' rel='stylesheet'></link>
      <Header></Header>
      <Toaster/>
        <BrowserRouter>
          <Routes>
            <Route path="/filminfo" element={<FilmInfo />} />
            <Route path="/booking/cinema"  element={<BookingCinema />} />
            <Route path="/films"  element={<Films />} />
            <Route path="/mytickets"  element={<MyTicketsPage />} />
            <Route path="/" element={<Home />}>
            </Route>
          </Routes>
        </BrowserRouter> 
    </QueryClientProvider> 
    
  </WagmiConfig >
    
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
