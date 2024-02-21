import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ActiveWeb3Provider from './context/useActiveWeb3';
import Web3KitProvider from './context/useWeb3KitProvider';

import WalletContextProvider from './context/walletContext';

import App from './App';
import './index.css';
import './satoshi.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <Web3KitProvider>
      <ActiveWeb3Provider>
        <WalletContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </WalletContextProvider>
      </ActiveWeb3Provider>
    </Web3KitProvider>
  // </React.StrictMode>
);

// <React.StrictMode> is rerendered twice, and then find unexpected errors.
// If project is product version, it should be removed