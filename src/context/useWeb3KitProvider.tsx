import { ReactNode } from "react";  
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, sepolia, polygonMumbai} from 'wagmi/chains';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import "@rainbow-me/rainbowkit/styles.css";;

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, polygon, arbitrum, sepolia, polygonMumbai],
    [publicProvider()]
);

const projectId: string = "177249e407d373ae3ed64ace1806e582";

const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    projectId: projectId,
    chains,
});

const config = createConfig({
    autoConnect: true,
    connectors: connectors,
    publicClient,
    webSocketPublicClient,
});
  
export default function Web3KitProvider({ children }: { children: ReactNode }) {
    return (
        <WagmiConfig config={config}>
            <RainbowKitProvider chains={chains}>
                {children}
            </RainbowKitProvider>
        </WagmiConfig>
    );
}