import './Header.css'
import logo from '../../assets/vue.png'
import { useConnect, useDisconnect, useAccount } from 'wagmi'
import { useEffect } from 'react'

const Header = () => {
    const { connectors, connect } = useConnect()
    const { isConnected, address } = useAccount()
    const { disconnect } = useDisconnect()

    useEffect(() => {
        document.title = 'Cinema Ticketing';
    }, []);

    const handleConnect = () => {
        const connector = connectors[0];
        if (connector) {
            connect({ connector });
        }
    };

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return(
        <div className='navbar'>
            <img src={logo} alt='' className='logo'/>
            <ul>
                <li><a href='/'>Home</a></li>
                <li><a href='/films'>Films</a></li>
                <li><a href='/mytickets'>My Tickets</a></li>
            </ul>
            {!isConnected ? (
                <button className='connect-button' onClick={handleConnect}>
                    Connect
                </button>
            ) : (
                <div className='account-controls'>
                    <span className='account-address'>{address && formatAddress(address)}</span>
                    <button className='disconnect-button' onClick={() => disconnect()}>
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    )
}

export default Header;