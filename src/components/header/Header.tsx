import './Header.css'
import logo from '../../assets/vue.png'
import { useConnect, useDisconnect, useAccount } from 'wagmi'
import { useEffect } from 'react'
const Header = () => {
    const { connectors, connect } = useConnect()
    const { isConnected } = useAccount()
    const { disconnect } = useDisconnect()

    useEffect(() => {
        document.title = 'Cinema Ticketing';
    }, []);

    return(
        <div className='navbar'>
            <img src={logo} alt='' className='logo'/>
            <ul>
                <li><a href='/'>Home</a></li>
                <li><a href='/films'>Films</a></li>
                <li><a href='/mytickets'>My Tickets</a></li>
            </ul>
            <div className={isConnected ? 'hidden' : 'search-box'}>
                {
                    connectors.map((connector) => (
                        <button key={connector.id}  onClick={() => connect({ connector })}>
                            Connect
                        </button>
                    ))
                }
            </div>
            {/* {address && <div>{ensName ? `${ensName} (${address})` : address}</div>} */}
            <button  className={isConnected ? 'search-box' : 'hidden'} onClick={() => disconnect()}>Disconnect</button>
            {/* <div className='search-box'>
                <input type='text' placeholder='Search'></input>
                <img src={searchIcon} alt='' className='searchLogo'/>
            </div> */}
        </div>
    )
}

export default Header;