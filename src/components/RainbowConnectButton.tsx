import React from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const RainbowConnectButton = () => {
    const { isConnecting } = useAccount();

    return isConnecting? (
        <div>
            <ConnectButton />
            <br />
            connected
        </div>

    ) : (
        <div>
            <ConnectButton />
            not connected
        </div>
    );
};

export default RainbowConnectButton;