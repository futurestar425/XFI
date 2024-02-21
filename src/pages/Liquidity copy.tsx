import React, { useEffect } from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';
import { useActiveWeb3 } from '../context/useActiveWeb3.js';
import { Tab, initTE } from 'tw-elements';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useWallet from "../hooks/useWallet.js";

import InputBoxLiquidity from '../components/InputBoxLiquidity.js';
import SpinnerButton from '../components/SpinnerButton.js';
import AaveVault from '../abi/AaveVault.json';
import USDT from '../abi/USDT.json';
import XFI from '../abi/XFI.json';
import UNI_LP from '../abi/UNI_LP.json';
import UniswapV2Factory from '../abi/UniswapV2Factory.json';
initTE({ Tab });

import Web3 from 'web3';
declare let window: any;

function Liquidity() {
  const { usdtAddress, xfiAddress, vaultAddress, factoryAddress, pairAddress, usdtBalance, xfiBalance, xfiVaultBalance, isPair, connectWallet} = useWallet();

  const { account, chainId, isConnected, library } = useActiveWeb3(); 
  const [balanceLP, setBalanceLP] = useState("0.0");
  const [balanceMaxLP, setBalanceMaxLP] = useState("0.0");
  const [inputA, setInputUSDT] = useState("0");
  const [inputB, setInputXFI] = useState("0");
  const [inputC, setInputLP] = useState("0");
  const [xxxAmountOfVault, setXXXAmountOfVault] = useState("0");
  const [isOwner, setIsOwner] = useState(false);
  const [reserveUSDT, setReserveUSDT] = useState('0.00');
  const [reserveXXX, setReserveXXX] = useState('0.00');
  const [reserveMaxUSDT, setReserveMaxUSDT] = useState('0.00');
  const [reserveMaxXXX, setReserveMaxXXX] = useState('0.00');

  const [value, setValue] = useState(1);
  const [isProgressing, setIsProgressing] = useState(false);
  const [isProgressing2, setIsProgressing2] = useState(false);
  const [isProgressing3, setIsProgressing3] = useState(false);
  const [isProgressing4, setIsProgressing4] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  const _web3 = new Web3(window.ethereum);
  const gasValue = _web3.utils.toWei('150', 'gwei');
  
  const connectWallet_ = async () => {
    try {
      const aaveVault: any = new _web3.eth.Contract(AaveVault, vaultAddress);
      // check usdt-xfi pool exist
      if (true) {
        console.log("---------- pair", pairAddress);
        const uniLP: any = new _web3.eth.Contract(UNI_LP, pairAddress);
        const lpAmount = await uniLP.methods.balanceOf(account).call();        

        const lpEth = _web3.utils.fromWei(lpAmount, 'ether');
        setBalanceMaxLP(lpEth);
        console.log("lpEth", lpEth)

        setBalanceLP((parseFloat(lpEth).toFixed(8)).toString()); 

        const result = await aaveVault.methods.getReserveAmount(usdtAddress, xfiAddress).call();
        const _usdtAmount = result[0];
        const _xxxAmount = result[1];
        const _usdtEth = _web3.utils.fromWei(_usdtAmount, 'mwei');
        const _xxxEth = _web3.utils.fromWei(_xxxAmount, 'ether');
        setReserveMaxUSDT(_usdtEth);
        setReserveMaxXXX(_xxxEth);
        setReserveUSDT((parseFloat(_usdtEth).toFixed(3)).toString());
        setReserveXXX((parseFloat(_xxxEth).toFixed(3)).toString());
      } 

      // check current user is owner
      const ownerAddress = await aaveVault.methods.getOwnerAddress().call();
      console.log("owner address --------", ownerAddress);
      if (account === ownerAddress) {
        setIsOwner(true);
      } 
    } catch (e: any) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (chainId !== undefined || !library) {   
      connectWallet_();
    } else {
      toast.info("Please connect to your wallet");
      console.log("Please connect to your wallet");
    }
  }, [account, chainId, isConnected, balanceLP, isPair, pairAddress]);

  
  const handleMaxUSDT = () => {
    setInputUSDT(usdtBalance);
  };

  const handleMaxXXX = () => {
    setInputXFI(xfiBalance);
  };
  
  const handleMaxLiquidity = () => {
    setInputLP(balanceMaxLP);
  };

  const handleMaxXXXOfVault = () => {
    setXXXAmountOfVault(xfiVaultBalance);
  };

  const handleInputSwapChange = async (e: any) => {
    const inputValue = e.target.value;
    if (!/^-?\d*\.?\d*$/.test(inputValue)) {
      // If the input is not a valid float, prevent the change
      e.target.value = inputValue.slice(0, -1);
    }
    setInputUSDT(e.target.value);
    const outAmount = previewAmount(e.target.value, false);
    setInputXFI(outAmount);
  };

  const handleOutputSwapChange = async (e: any) => {
    const inputValue = e.target.value;
    if (!/^-?\d*\.?\d*$/.test(inputValue)) {
      // If the input is not a valid float, prevent the change
      e.target.value = inputValue.slice(0, -1);
    }
    setInputXFI(e.target.value);
    // const outAmount = previewAmount(e.target.value, true);
    // setInputUSDT(outAmount);
  };

  const previewAmount = (inputAmount: any, isXXX: boolean): string => {
    let outAmount: any;
    if(parseFloat(reserveMaxUSDT) == 0) {
      outAmount = inputAmount;
    } else {
      if(isXXX) {
        const temp = inputAmount * parseFloat(reserveMaxUSDT);
        outAmount = temp / parseFloat(reserveMaxXXX);
      } else {
        const temp = inputAmount * parseFloat(reserveMaxXXX);
        outAmount = temp / parseFloat(reserveMaxUSDT);
      }
    }
    
    return outAmount.toString();
  }

  const handleLPChange = async (e: any) => {
    const inputValue = e.target.value;
    if (!/^-?\d*\.?\d*$/.test(inputValue)) {
      // If the input is not a valid float, prevent the change
      e.target.value = inputValue.slice(0, -1);
    }
    setInputLP(e.target.value);
  }

  const handleXXXOfVaultChange = async (e: any) => {
    const inputValue = e.target.value;
    if (!/^-?\d*\.?\d*$/.test(inputValue)) {
      // If the input is not a valid float, prevent the change
      e.target.value = inputValue.slice(0, -1);
    }
    setXXXAmountOfVault(e.target.value);
  }

  const handleAddLiquidity = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!isConnected) {
      toast.info("Please connect to your wallet");
      return;
    }

    try {
      const usdt: any = new _web3.eth.Contract(USDT, usdtAddress);
      const xxx: any = new _web3.eth.Contract(XFI, xfiAddress);
      const aaveVault = new _web3.eth.Contract(AaveVault, vaultAddress);

      let updatedInputA = inputA;
      const decimalPlaces = (inputA.split('.')[1] || '').length; // check the inputA decimal places (inputA = 1.009, then decimalPlaces = 3)
      if (decimalPlaces > 6) {
        const fixedDecimalsOfUSDT = parseFloat(inputA).toFixed(6); // fix usdt decimals as 6
        updatedInputA = fixedDecimalsOfUSDT.toString(); 
      }
      const amountUSDT = _web3.utils.toWei(updatedInputA, 'mwei');
      const amountXXX= _web3.utils.toWei(inputB, 'ether');
      
      setIsProgressing(true);
      setIsDisable(true);
      alert(vaultAddress+amountUSDT+account);
      await usdt.methods.approve(vaultAddress, amountUSDT).send({ from: account, gasPrice: gasValue});
      toast.success('USDT Approve Success');
      
      await xxx.methods.approve(vaultAddress, amountXXX).send({ from: account, gasPrice: gasValue});
      toast.success('XFI Approve Success');

      await aaveVault.methods.addLiquidityWithERC20(usdtAddress, xfiAddress, amountUSDT, amountXXX, account).send({from:account, gasPrice: gasValue});
      toast.success('Add Liquidity Success');

      if (connectWallet) {
        connectWallet();
      }
  
      // set UNI_LP balance in remove liquidity tab
      if (isPair) {
        const uniLP: any = new _web3.eth.Contract(UNI_LP, pairAddress);
        const lpAmount = await uniLP.methods.balanceOf(account).call();
        const lpEth = _web3.utils.fromWei(lpAmount, 'ether');
        setBalanceMaxLP(lpEth);
        setBalanceLP((parseFloat(lpEth).toFixed(8)).toString());  
      }

      setIsProgressing(false);
      setIsDisable(false);
    } catch (error: any) {
      toast.error("Add Liquidity Failed");
      setIsProgressing(false);
      setIsDisable(false);
      console.log(error);
    }
  };

  const handleRemoveLiquidity = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!isConnected) {
      toast.info("Please connect to your wallet");
      return;
    }

    try {                  
      const aaveVault = new _web3.eth.Contract(AaveVault, vaultAddress);
      const factory = new ethers.Contract(factoryAddress, UniswapV2Factory, library);
      const pairAddress = await factory.getPair(usdtAddress, xfiAddress);
      if (!isPair) {
        toast.info("Please Add Liquidity First");
        return;
      }

      const uniLP: any = new _web3.eth.Contract(UNI_LP, pairAddress);
      const amountLP = _web3.utils.toWei(inputC, 'ether');  

      setIsProgressing2(true);
      setIsDisable(true);
      await uniLP.methods.approve(vaultAddress, amountLP).send({from:account, gasPrice: gasValue});
      toast.success('LP Token Approve Success');
        
      await aaveVault.methods.removeLiquidityWithERC20(usdtAddress, xfiAddress, amountLP, account).send({from: account, gasPrice: gasValue});
      toast.success('Remove Liquidity Success');
      
      if (connectWallet) {
        connectWallet();
      }

      setIsProgressing2(false);
      setIsDisable(false);
    } catch (error: any) {
      toast.error("Remove Liquidity Failed");
      setIsProgressing2(false);
      setIsDisable(false);
      console.log(error);
    }
  };

  const handleAddXXX = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!isConnected) {
      toast.info("Please connect to your wallet");
      return;
    }

    try {      
      const xxx: any = new _web3.eth.Contract(XFI, xfiAddress);
      const aaveVault = new _web3.eth.Contract(AaveVault, vaultAddress);
      const amountXXX= _web3.utils.toWei(xxxAmountOfVault, 'ether');

      setIsProgressing3(true);
      setIsDisable(false);
      await xxx.methods.approve(vaultAddress, amountXXX.toString()).send({ from: account, gasPrice: gasValue});
      toast.success('XFI Approve Success');

      await aaveVault.methods.addXXXForVault(amountXXX.toString()).send({from: account, gasPrice: gasValue});
      toast.success('Transfer XFI Success');

      if (connectWallet) {
        connectWallet();
      }

      setIsProgressing3(false);
      setIsDisable(false);
    } catch (error: any) {
      toast.error("Add XFI Failed");
      setIsProgressing3(false);
      setIsDisable(false);
      console.log(error);
    }

  };

  const handleRemoveXXX = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!isConnected) {
      toast.info("Please connect to your wallet");
      return;
    }

    try {      
      const xxx: any = new _web3.eth.Contract(XFI, xfiAddress);
      const aaveVault = new _web3.eth.Contract(AaveVault, vaultAddress);
      const amountXXX= _web3.utils.toWei(xxxAmountOfVault, 'ether');
      
      setIsProgressing4(true);
      setIsDisable(true);

      await xxx.methods.approve(vaultAddress, amountXXX.toString()).send({from:account, gasPrice: gasValue});
      toast.success('XFI Approve Success');

      await aaveVault.methods.removeXXXFromVault(amountXXX.toString()).send({from: account, gasPrice: gasValue});
      toast.success('Remove XFI from Vault');

      if (connectWallet) {
        connectWallet();
      }

      setIsProgressing4(false);
      setIsDisable(false);
    } catch (error: any) {
      toast.error("Remove XFI Failed");
      setIsProgressing4(false);
      setIsDisable(false);
      console.log(error);
    }
  };

  return (
    <div className=''>
      <div className="w-[600px] m-auto mt-10 border-2 border-black/5 shadow1-xl rounded-[20px] h-[580px] border-gray-100 dark:border-slate-800 dark:bg-slate-800">
          
          <div className="flex gap-3 border-gray-200 dark:border-gray-900 shadow-md py-3 px-5">
            <div className={`w-full  `}>
              <p className={` w-full text-xl  font-bold text-left dark:text-gray-200`}>
                <button onClick={() => setValue(1)} 
                className={`min-h-[70px] w-full border rounded-lg py-3 px-10 border-[#3c50df]
                ${value==1 && 'bg-[#3c50df] text-white'}
                `}>Add Liquidity </button>
              </p>
            </div>
            <div className={`w-full`}>
              <p className={` text-xl font-bold text-left dark:text-gray-200`}>
                <button onClick={() =>setValue(2)} 
                className={`min-h-[70px] w-full border rounded-lg py-3 px-10 border-[#3c50df] 
                ${value==2 && 'bg-[#3c50df] text-white'}
                `}>Remove Liquidity</button>
              </p>
            </div>
            {
              isOwner &&
              <div className='w-full h-full'>
                <p className={` text-xl font-bold text-left dark:text-gray-200 `}>
                  <button onClick={() =>setValue(3)} 
                  className={`min-h-[70px] w-full h-full border rounded-lg py-3 px-10 border-[#3c50df] 
                  ${value==3 && 'bg-[#3c50df] text-white'}
                  `}>Add XFI Token</button>
                </p>
              </div>
            }
          </div>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          {
            value ==1 
            ?
              (<div>
                  <div className="p-4">
                    <InputBoxLiquidity
                      name="inToken"
                      balance={parseFloat(usdtBalance.toString()).toFixed(3)}
                      value={inputA}
                      token={'USDT'}
                      onChange={handleInputSwapChange}
                      setMaxAmount={handleMaxUSDT}
                    />
                    <InputBoxLiquidity
                      name="outToken"
                      balance={parseFloat(xfiBalance.toString()).toFixed(3)}
                      value={inputB}
                      token={'XFI'}
                      onChange={handleOutputSwapChange}
                      setMaxAmount={handleMaxXXX}
                    />
                  </div>
                  <div className="flex justify-center">
                    {isProgressing?
                    (
                      <div className='place-content-center mx-5 w-full mt-15 px-10 font-bold text-white bg-primary rounded-md'>
                        <SpinnerButton text="Adding Liquidity" />
                      </div>
                    ):
                    (
                      <button
                        type="button"
                        className="place-content-center mx-5 w-full mt-15 py-2 px-10 text-xl font-bold text-white bg-primary rounded-full bg-opacity-85 hover:bg-opacity-90 disabled:bg-indigo-400"
                        disabled={inputA === "0" || inputB === "0" || isDisable}
                        onClick={handleAddLiquidity}
                      >
                        {inputA === "0" || inputB === "0"
                          ? "Enter an amount"
                          : "Add Liquidity"}
                      </button>
                    )}
                  </div>
              </div>) 
            : 
              value==2 
            ?
              (<div>
                <div className="p-4">
                  <InputBoxLiquidity
                    name="inputToken"
                    token={'LP Token'}
                    balance={balanceLP}
                    onChange={handleLPChange}
                    value={inputC}
                    setMaxAmount={handleMaxLiquidity}
                  />
                </div>
                <div className='place-content-center w-full mt-8 py-2 px-10 text-lg flex justify-between'>
                  <span>USDT : </span>
                  <span>{reserveUSDT} </span>
                </div>
                <div className='place-content-center w-full mt-5 py-2 px-10 text-lg flex justify-between'>
                  <span>XFI : </span>
                  <span>{reserveXXX} </span>
                </div>
                <div className="flex justify-center">
                  {isProgressing2?
                  (
                    <div className='place-content-center mx-5 w-full mt-15 px-10 font-bold text-white bg-primary rounded-md'>
                      <SpinnerButton text="Removing Liquidity" />
                    </div>
                  ):
                  (
                    <button
                      type="button"
                      className="place-content-center mx-5 w-full mt-15 py-2 px-10 text-lg font-bold text-white bg-primary rounded-full bg-opacity-85 hover:bg-opacity-90 disabled:bg-indigo-400"
                      disabled={inputC === "0" || isDisable}
                      onClick={handleRemoveLiquidity}
                    >
                      {inputC === "0"
                        ? "Enter an amount"
                        : "Remove Liquidity"}
                    </button>
                  )}
                </div>
              </div>) 
            :
              (<div>
                  <div className="p-4 pb-10">
                    <InputBoxLiquidity
                      name="inputToken"
                      token={'XFI'}
                      balance={parseFloat(xfiVaultBalance.toString()).toFixed(3)}
                      onChange={handleXXXOfVaultChange}
                      value={xxxAmountOfVault}
                      setMaxAmount={handleMaxXXXOfVault}
                    />
                    <div className='place-content-center w-full mt-20 py-2 px-8 text-lg flex justify-between'>
                      <span>Owner XFI Balance : </span>
                      <span>{parseFloat(xfiBalance.toString()).toFixed(3)} </span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    {isProgressing3 ?
                    (
                      <div className='place-content-center mx-5 w-full px-10 font-bold text-white bg-primary rounded-md'>
                        <SpinnerButton text="Adding XFI" />
                      </div>
                    ):
                    (
                      <button
                        type="button"
                        className="place-content-center mx-5 w-full py-2 px-10 text-lg font-bold text-white bg-primary rounded-md bg-opacity-85 hover:bg-opacity-90 disabled:bg-indigo-400"
                        disabled={xxxAmountOfVault === "0" || isDisable}
                        onClick={handleAddXXX}
                      >
                        {xxxAmountOfVault === "0"
                          ? "Enter an amount"
                          : "Add XFI"}
                      </button>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {isProgressing4?
                    (
                      <div className='place-content-center mx-5 w-full mt-7 px-10 font-bold text-white bg-primary rounded-md'>
                        <SpinnerButton text="Removing XFI" />
                      </div>
                    ):
                    (
                      <button
                        type="button"
                        className="place-content-center mx-5 w-full mt-7 py-2 px-10 text-lg font-bold text-white bg-primary rounded-md bg-opacity-85 hover:bg-opacity-90 disabled:bg-indigo-400"
                        disabled={xxxAmountOfVault === "0" || isDisable}
                        onClick={handleRemoveXXX}
                      >
                        {xxxAmountOfVault === "0"
                          ? "Enter an amount"
                          : "Remove XFI"}
                      </button>
                    )}
                  </div>
              </div>)  
          }
      </div>
    </div>
  );
}

export default Liquidity;