import { ConnectButton } from '@rainbow-me/rainbowkit';

export const ConnectWalletButton = () => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted, }) => {
        // Note: If your app doesn't use authentication, you can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');
        
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-primary py-1 px-2 text-center text-white hover:bg-opacity-70 bg-primary lg:px-8 xl:px-10"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-primary py-1 px-2 text-center text-white hover:bg-opacity-70 bg-primary lg:px-8 xl:px-10"
                  >
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: 'flex', gap: 30 }}>
                  <button 
                  onClick={openAccountModal} 
                  type="button"
                  className="lg:inline-flex hidden items-center justify-center rounded-full border border-primary py-1 px-5 font-semibold text-center text-primary hover:text-white hover:bg-primary/70"
                  >
                    {account.displayName}
                  </button>
                  <button
                    onClick={openChainModal}
                    style={{ display: 'flex' }}
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-gray-300 py-1 px-5 text-center text-white hover:bg-opacity-70 bg-primary"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 20,
                          height: 20,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 10,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 20, height: 20 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>
                  
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};