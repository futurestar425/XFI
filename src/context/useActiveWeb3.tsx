import { createContext, ReactNode, useContext, useMemo } from "react";
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { useEthersProvider, useEthersSigner } from "../utils/wagmi-ethers";
import { ContractRunner } from "ethers";

const ActiveWeb3Context = createContext<any[]>([null]);

function useActiveWeb3Context() {
  return useContext(ActiveWeb3Context);
}

/** Requires that BlockUpdater be installed in the DOM tree. */
export function useActiveWeb3(): {
  account?: any;
  chainId?: number;
  connector?: any;
  isConnecting?: boolean;
  isConnected?: boolean;
  library?: ContractRunner;

  switchNetwork?: any;
  disconnect?: any;
} {
  const [data] = useActiveWeb3Context();
  return data;
}

export default function ActiveWeb3Provider({
  children,
}: {
  children: ReactNode;
}) {
  const { address, connector, isConnecting, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const { switchNetwork } = useSwitchNetwork();
  const signer = useEthersSigner();
  const provider = useEthersProvider();

  const value = useMemo(
    () => [
      {
        account: address,
        chainId: chain?.id,
        connector,
        isConnecting,
        isConnected,
        library: signer ?? provider,
        disconnect,
        switchNetwork,
      },
      isConnecting,
    ],
    [
      address,
      chain?.id,
      connector,
      disconnect,
      isConnected,
      isConnecting,
      provider,
      signer,
      switchNetwork,
    ]
  );

  return (
    <ActiveWeb3Context.Provider value={value}>
      {children}
    </ActiveWeb3Context.Provider>
  );
}
