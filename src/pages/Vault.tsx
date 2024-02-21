import { useState, useEffect } from 'react';
import ChartThree4 from '../components/ChartThree4.tsx';
import DepositWithdraw from './DepositWithdraw.tsx';
import { ethers } from 'ethers';
import { useActiveWeb3 } from '../context/useActiveWeb3.js';
import useWallet from "../hooks/useWallet.js";
import AaveVault from '../abi/AaveVault.json';

const Vault = () => {
  const { vaultAPY, totalValueLocked, shareBalance, userReward, vaultAddress, isPair} = useWallet();
  const { account, chainId, isConnected, library } = useActiveWeb3(); 
  const [lastHarvestTime, setLastHarvestTime] = useState('0');
  const [currentTime, setCurrentTime] = useState(0);
  const [differenceTime, setDifferenceTime] = useState('0 minutes ago');

  const connectWallet = async () => {
    try {      
      const aaveVault = new ethers.Contract(vaultAddress, AaveVault, library);

      if (isPair) {
        const userInfo = await aaveVault.getUserInfo(account);
        setLastHarvestTime(userInfo._lastClaimedTime.toString());
        // const _lastHarvestTime = Number(userInfo._lastClaimedTime);
        // const date = new Date(_lastHarvestTime * 1000); // convert to milliseconds
        // const dateString = date.toLocaleString(); // convert to local date and time string
        // console.log("time ----------------------", dateString); // output: "12/7/2021, 12:00:00 AM"
      }
    } catch (e: any) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (chainId !== undefined || !library) {   
      connectWallet();
    } else {
      console.log("Please connect to your wallet");
    }
  }, [account, chainId, isConnected]);

  useEffect(() => {
    const getCurrentTime = () => {
      const currentTime = Date.now();
      setCurrentTime(currentTime);
    };
    setInterval(getCurrentTime, 60 * 1000);
  }, []);

  useEffect(() => {
    const getDifference  = () => {
      if (lastHarvestTime === '0') return;
      const _lastHarvestTime = Number(lastHarvestTime);
      const lastHarvestMilliSeconds = _lastHarvestTime * 1000;
      const currentDateMilliSeconds = Date.now(); // convert to milliseconds
      const differenceMilliseconds = currentDateMilliSeconds - lastHarvestMilliSeconds;

      if (differenceMilliseconds < 0) return;
      const differenceMinutes = Math.floor(differenceMilliseconds / (60 * 1000));
      const differenceHours = Math.floor(differenceMilliseconds / (60 * 60 * 1000)); 
      const differenceDates = Math.floor(differenceMilliseconds / (24 * 60 * 60 * 1000)); 
      
      setDifferenceTime(differenceMinutes.toString() + " minutes ago");
      if (differenceHours > 0) {
        setDifferenceTime(differenceHours.toString() + " hours ago");
      }
      if (differenceDates > 0) {
        setDifferenceTime(differenceDates.toString() + " days ago");
      }
      
    };
    getDifference ();
  }, [lastHarvestTime, currentTime]);

  return (
    <div className=''>
        <h1 className='my-5 mx-3 font-bold text-3xl'>USDC xLP Vault</h1>
        
        <div className="flex justify-between items-center gap-4 md:grid-cols-1 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
          <div className="font-medium border rounded-lg py-3 w-1/3 inline-flex">
            <div className="hover:text-black text-center w-1/2 border-r mx-2">
              <div className='text-sm'>TVL</div>
              <div className='text-2xl pt-2'>{totalValueLocked}</div>
            </div>
            <div className="hover:text-black text-center w-1/2 mx-2">
              <div className='text-sm'>APY</div>
              <div className='text-2xl pt-2'>{vaultAPY}%</div>
            </div>
          </div>
          <div className="font-medium border rounded-lg py-3 w-2/3 inline-flex">
            <div className="hover:text-black text-center w-1/3 border-r mx-2">
              <div className='text-sm'>Your Deposit</div>
              <div className='text-2xl pt-2'>{shareBalance}</div>
            </div>
            <div className="hover:text-black text-center w-1/3 border-r mx-2">
              <div className='text-sm'>Last Harvest</div>
              <div className='text-2xl pt-2'>{differenceTime}</div>
            </div>
            <div className="hover:text-black text-center w-1/3 mx-2">
              <div className='text-sm'>Your reward</div>
              <div className='text-2xl pt-2'>{parseFloat(userReward).toFixed(3)}</div>
            </div>
          </div>
        </div>

        <div className="flex mt-10 grid-cols-3 gap-4 md:grid-cols-1 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
          <ChartThree4 />
          <DepositWithdraw />
        </div>
    </div>
  );
};

export default Vault;