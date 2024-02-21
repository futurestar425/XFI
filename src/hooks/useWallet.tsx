import React from 'react';
import { WalletContext } from '../context/walletContext';

const useWallet = () => {
    const context = React.useContext(WalletContext);
    
    //@ts-ignore
    if  (!context) {
        throw new Error("no context");
    } else {
        return context;
    }
}

export default useWallet;