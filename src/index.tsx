import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import FilmInfo from './pages/FilmInfo';
import BookingCinema from './pages/BookingCinema';
import Films from './pages/Films';
import MyTicketsPage from './pages/MyTicketsPage';
import { WagmiProvider, http, createConfig } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/header/Header';

const config = createConfig({
  chains: [avalancheFuji],
  connectors: [injected()],
  transports: {
    [avalancheFuji.id]: http(),
  },
});

document.title = 'Cinema Ticketing';
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <WagmiProvider config={config}>
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
  </WagmiProvider>
);
