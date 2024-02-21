import React, { createContext, ReactNode } from "react";
import { ethers } from 'ethers';
import { isAddress } from 'web3-validator';
import { useActiveWeb3 } from '../context/useActiveWeb3.js';
import { chainIdToInfo } from "../constant";

import USDC from '../abi/USDC.json';
import USDT from '../abi/USDT.json';
import XFI from '../abi/XFI.json';
import AaveVault from '../abi/AaveVault.json';
import UniswapV2Factory from '../abi/UniswapV2Factory.json';

interface WalletContextType {
  currentChainInfo?: ChainInfo,
  vaultAddress: string,
  usdcAddress: string,
  usdtAddress: string,
  xfiAddress: string,
  factoryAddress: string,
  pairAddress: string,
  
  assetBalance: string,
  shareBalance: string,
  usdtBalance: string,
  xfiBalance: string,
  xfiVaultBalance: string,
  totalValueLocked: string,
  vaultAPY: string,
  userReward: string,
  isPair: boolean,
  
  connectWallet?: Function
}

const initialValue = {
  currentChainInfo: undefined,
  vaultAddress: "",
  usdcAddress: "",
  usdtAddress: "",
  xfiAddress: "",
  factoryAddress: "",
  pairAddress: "",

  assetBalance: "",
  shareBalance: "",
  usdtBalance: "",
  xfiBalance: "",
  xfiVaultBalance: "",
  totalValueLocked: "",
  vaultAPY: "",
  userReward: "",
  isPair: false
}

export const WalletContext = createContext<WalletContextType>(initialValue);

const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const { account, chainId, isConnected, library } = useActiveWeb3(); 
  const [currentChainInfo, setCurrentChainInfo] = React.useState<ChainInfo | undefined>();
  
  const [assetBalance, setAssetBalance] = React.useState<string>('0.00');
  const [shareBalance, setShareBalance] = React.useState<string>('0.00');
  const [usdtBalance, setUSDTBalance] = React.useState<string>('0.00');
  const [xfiBalance, setXFIBalance] = React.useState<string>('0.00');
  const [xfiVaultBalance, setXFIVaultBalance] = React.useState<string>('0.00');
  const [totalValueLocked, setTotalValueLocked] = React.useState<string>('0.00');
  const [vaultAPY, setVaultAPY] = React.useState('0.00');
  const [userReward, setUserReward] = React.useState('0.00');
  const [isPair, setIsPair] = React.useState(false);
  
  const [ vaultAddress, setVaultAddress ] = React.useState<string>("");
  const [ usdcAddress, setUSDCAddress ] = React.useState<string>("");
  const [ usdtAddress, setUSDTAddress ] = React.useState<string>("");
  const [ xfiAddress, setXFIAddress ] = React.useState<string>("");
  const [ factoryAddress, setFactoryAddress ] = React.useState<string>("");
  const [ pairAddress, setPairAddress ] = React.useState<string>("");

  React.useEffect(() => {
    if (isAddress(account) || chainId !== undefined || !library) {
      // Get ChainInfo for current chain id
      const currentChainId:number = chainId!; // ! is used to assert that chainId is non-null
      if (currentChainId === 1 || currentChainId === 42161) { // if current chain is Ethereum, or Arbitrum
        console.log("Not supported chain ", currentChainId);
      } else {
        setCurrentChainInfo(chainIdToInfo[currentChainId]);
        connectWallet(chainIdToInfo[currentChainId]);
      }    
    } else {
      console.log("Please connect to your wallet");
    }
    
  }, [account, chainId, isConnected, assetBalance, shareBalance, usdtBalance, xfiBalance, xfiVaultBalance, pairAddress, userReward]);
  
  const connectWallet = async (_currentChainInfo: ChainInfo | undefined  = currentChainInfo) => {
    try {
      if (!_currentChainInfo) {
        throw new Error("connect the wallet");
      }

      const _vaultAddress = _currentChainInfo?._vault;
      const _assetAddress = _currentChainInfo?._asset;
      const _usdtAddress = _currentChainInfo?._usdt;
      const _xfiAddress = _currentChainInfo?._xfi;
      const _factoryAddress = _currentChainInfo?._factory;

      setVaultAddress(_vaultAddress!);
      setUSDCAddress(_assetAddress!);
      setUSDTAddress(_usdtAddress!);
      setXFIAddress(_xfiAddress!);
      setFactoryAddress(_factoryAddress!);
      
      const _aaveVault = new ethers.Contract(_vaultAddress, AaveVault, library);
      const _usdc = new ethers.Contract(_assetAddress, USDC, library);
      const _usdt = new ethers.Contract(_usdtAddress, USDT, library);
      const _xfi = new ethers.Contract(_xfiAddress, XFI, library);
      const _factory = new ethers.Contract(_factoryAddress, UniswapV2Factory, library);
     

      // Get balance of asset, share, USDT, XFI token
      const assetTokenAmount = await _usdc.balanceOf(account); // asset token - vault deposit token (USDC)
      const shareTokenAmount = await _aaveVault.balanceOf(account); // share token - LP token (vUSDC)
      const usdtAmount = await _usdt.balanceOf(account);
      const xfiAmount = await _xfi.balanceOf(account);
      const xfiAmountOfVault = await _xfi.balanceOf(_vaultAddress);
      const assetEth = ethers.formatUnits(assetTokenAmount, 'mwei');
      const shareEth = ethers.formatUnits(shareTokenAmount, 'mwei');
      const usdtEth = ethers.formatUnits(usdtAmount, 'mwei');
      const xfiEth = ethers.formatEther(xfiAmount);
      const xfiVaultEth = ethers.formatEther(xfiAmountOfVault);
      setAssetBalance(assetEth);
      setShareBalance(shareEth);
      setUSDTBalance(usdtEth);
      setXFIBalance(xfiEth);
      setXFIVaultBalance(xfiVaultEth);
      
      // Get current TVL
      const tvlAmount = await _aaveVault.totalValueLocked();
      console.log("_pairAddress", tvlAmount);
      const tvlEth = ethers.formatUnits(tvlAmount, 'mwei');
      setTotalValueLocked(tvlEth);
      
      // Get XFI-USDT pair address
      const _pairAddress = await _factory.getPair(usdtAddress, xfiAddress);
      if (parseFloat(tvlAmount) === 0 || _pairAddress.toLowerCase() === '0x0000000000000000000000000000000000000000') {
        
        setVaultAPY("0.00");
        setUserReward("0.00");
        setIsPair(false);
      } else {
        const _vaultAPY = await _aaveVault.getVaultAPY(); // 10000: 100%, 100: 1%
        const apy = parseFloat(_vaultAPY)/100;
        setVaultAPY(apy.toString());

        if (await _aaveVault.isVaultUser(account)) {
          const rewardXXXAmount = await _aaveVault.getRewardXXX(shareTokenAmount);
          const userRewardEth = ethers.formatEther(rewardXXXAmount);
          
          setUserReward(userRewardEth);
        } else {
          setUserReward("0.00");
        }
        setIsPair(true);
        setPairAddress(_pairAddress);
      }
    } catch (e: any) {
      console.log(e);
    }
  }

  return (
    <WalletContext.Provider value={{ 
      currentChainInfo,
      vaultAddress,
      usdcAddress,
      usdtAddress,
      xfiAddress,
      factoryAddress,
      pairAddress,

      assetBalance,
      shareBalance,
      usdtBalance,
      xfiBalance,
      xfiVaultBalance,
      totalValueLocked,
      vaultAPY,
      userReward,
      isPair,
      connectWallet
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export default WalletContextProvider;