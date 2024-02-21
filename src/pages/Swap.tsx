import React from 'react';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ethers } from 'ethers';
import { useActiveWeb3 } from '../context/useActiveWeb3.js';
import { Tab, initTE } from 'tw-elements';
import useWallet from "../hooks/useWallet.js";

import USDT from '../abi/USDT.json';
import XFI from '../abi/XFI.json';
import AaveVault from '../abi/AaveVault.json';
import UniswapV2Factory from '../abi/UniswapV2Factory.json';
import InputBox from '../components/InputBox.js';

import SpinnerButton from '../components/SpinnerButton.js';
initTE({ Tab });

import Web3 from 'web3';
declare let window: any;

function Swap() {
  const { factoryAddress, vaultAddress, usdtAddress, xfiAddress, usdtBalance, xfiBalance, connectWallet } = useWallet();

  const { account, chainId, isConnected, library } = useActiveWeb3();
  const [tokenA, setTokenA] = useState('0');
  const [tokenB, setTokenB] = useState('0');

  const [balanceA, setBalanceA] = useState("0.0");
  const [balanceB, setBalanceB] = useState("0.0");
  const [balanceMaxA, setBalanceMaxA] = useState("0.0");
  const [balanceMaxB, setBalanceMaxB] = useState("0.0");

  const [inputA, setInputA] = useState("0");
  const [inputB, setInputB] = useState("0");
  const [reserveMaxUSDT, setReserveMaxUSDT] = useState('0.00');
  const [reserveMaxXXX, setReserveMaxXXX] = useState('0.00');

  const [isSwap, setIsSwap] = useState(true);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isVisibleTokenA, setIsVisibleTokenA] = useState(false);
  const [isVisibleTokenB, setIsVisibleTokenB] = useState(false);

  const [hasLiquidityPool, setHasLiquidityPool] = useState(false);
  const [gasLimit, setGasLimit] = useState('0.00');

  const options = ['USDT', 'XFI'];
  const options2 = ['XFI', 'USDT'];
  const _web3 = new Web3(window.ethereum);
  const gasValue = _web3.utils.toWei('150', 'gwei');

  const connectWallet_ = async () => {
    try {
      const factory = new ethers.Contract(factoryAddress, UniswapV2Factory, library);
      const aaveVault = new ethers.Contract(vaultAddress, AaveVault, library);

      switch (tokenA) { // USDT - XFI
        case '0':
          setBalanceMaxA(usdtBalance);
          setBalanceA((parseFloat(usdtBalance).toFixed(3)).toString());
          break;
        case '1':
          setBalanceMaxB(xfiBalance);
          setBalanceA((parseFloat(xfiBalance).toFixed(3)).toString());
          break;
      }
      switch (tokenB) { // XFI - USDT
        case '0':
          setBalanceMaxB(xfiBalance);
          setBalanceB((parseFloat(xfiBalance).toFixed(3)).toString());
          break;
        case '1':
          setBalanceMaxA(usdtBalance);
          setBalanceB((parseFloat(usdtBalance).toFixed(3)).toString());
          break;
      }

      const pairAddress = await factory.getPair(usdtAddress, xfiAddress);
      if (pairAddress.toLowerCase() !== '0x0000000000000000000000000000000000000000') {
        setHasLiquidityPool(true);

        const result = await aaveVault.getReserveAmount(usdtAddress, xfiAddress);
        const _usdtAmount = result[0];
        const _xxxAmount = result[1];
        const _usdtEth = ethers.formatUnits(_usdtAmount, 'mwei');
        const _xxxEth = ethers.formatUnits(_xxxAmount, 'ether');
        setReserveMaxUSDT(_usdtEth);
        setReserveMaxXXX(_xxxEth);
      } else {
        setHasLiquidityPool(false);
      }

    } catch (e: any) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (chainId !== undefined || !library) {   
      connectWallet_();
    } else {
      console.log("Please connect to your wallet");
    }
  }, [account, chainId, isConnected, tokenA, tokenB, hasLiquidityPool, usdtBalance, xfiBalance]);

  useEffect(() => {
    handleInputA();
  }, [inputA]);

  const handleCurrentValue0Change = (e: any) => { // combobox 0
    setIsVisibleTokenA(!isVisibleTokenA);
    setTokenA(e.target.value);
  };

  const handleCurrentValue1Change = (e: any) => { // combobox 1
    setIsVisibleTokenB(!isVisibleTokenB);
    setTokenB(e.target.value);
  };

  const handleIsSwap = (isSwapClicked: boolean) => {
    setIsSwap(isSwapClicked);
  }

  const handleInputSwapChange = async (e: any) => { // input value change
    const inputValue = e.target.value;
    if (!/^-?\d*\.?\d*$/.test(inputValue)) {
      // If the input is not a valid float, prevent the change
      e.target.value = inputValue.slice(0, -1);
    }
    setInputA(e.target.value);

    if (inputA !== e.target.value) {
      setInputA(e.target.value);
    } 
  };

  const handleOutputSwapChange = async (e: any) => { // output value change
    const inputValue = e.target.value;
    if (!/^-?\d*\.?\d*$/.test(inputValue)) {
      // If the input is not a valid float, prevent the change
      e.target.value = inputValue.slice(0, -1);
    }
    setInputB(e.target.value);
  };

  const handleMaxAToken = () => {
    if (tokenA === '0') {
      setInputA(balanceMaxA);
    } else setInputA(balanceMaxB);
  }

  const handleMaxBToken = () => {
    if (tokenB === '0') {
      setInputB(balanceMaxB);
    } else setInputB(balanceMaxA);
  }

  const handleInputA = async () => { // preview inputB amout according to inputA amount
    if (!isConnected) return; // check is connected
    if (!hasLiquidityPool) return; // check usdt-xfi pool exist
    if (tokenA != tokenB) return; // check same token selected

    try {
      let ethAmount: string = "";
      const aaveVault = new ethers.Contract(vaultAddress, AaveVault, library);
      if (tokenA == '0' ) { // if token A is USDT
        if (parseFloat(inputA) >= parseFloat(reserveMaxUSDT)) return; // if input value is large than reserve amount

        const inAmount = ethers.parseUnits(inputA, 'mwei');
        const outAmount = await aaveVault.previewSwapAmountOut(usdtAddress, xfiAddress, inAmount);
        ethAmount = ethers.formatEther(outAmount.toString());
        console.log("--------------------------- USDT - XFI ", ethAmount);
      } 
      else if (tokenA == '1') { // if tokenA is XFI
        if (parseFloat(inputA) >= parseFloat(reserveMaxXXX)) return; // if input value is large than reserve amount
        
        const inAmount = ethers.parseUnits(inputA, 'ether');
        const outAmount = await aaveVault.previewSwapAmountOut(xfiAddress, usdtAddress, inAmount);
        ethAmount = ethers.formatUnits(outAmount.toString(), 'mwei');
        console.log("--------------------------- XFI - USDT ", ethAmount);
      }    

      setInputB(ethAmount);
      // const estimatedGasLimit = await aaveVault.swapExactToken0ForToken1.estimateGas(usdtAddress, xfiAddress, inAmount, 1, account);
      // const gasEther = ethers.formatEther(estimatedGasLimit);
      // setGasLimit(gasEther); 
    } catch(e:any) {
      console.log(e);
    } 
  }

  const handleSwapClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!isConnected) {
      toast.info("Please connect to your wallet");
      return;
    }

    if (!hasLiquidityPool) { // check usdt-xfi pool exist
      toast.info("Please add liquidity first");
      return; 
    }

    if (tokenA != tokenB) { 
      toast.info("Same Token Selected");
      return;
    }

    if(parseFloat(inputA) > parseFloat(balanceA)) {
      toast.info("Your account don't have enough funds!");
      return;
    }

    if (tokenA == '0' && tokenB == '0'){ // USDT-XFI
      swapExactToken0ForToken1_();
    }
    if (tokenA == '1' && tokenB == '1'){ // XFI-USDT
      swapExactToken0ForToken2_();
    }
    setInputA('');
    setInputB('');
  };

  async function swapExactToken0ForToken1_() {
    try {      
      const usdt: any = new _web3.eth.Contract(USDT, usdtAddress);
      const aaveVault = new _web3.eth.Contract(AaveVault, vaultAddress);
      if (parseFloat(inputA) >= parseFloat(reserveMaxUSDT)) { // if input value is large than reserve amount
        toast.warn("Overflow USDT reserve amount! Please input value again.");
        return;
      }; 

      let shareEther:any;
      setIsSwapping(true);
      shareEther = _web3.utils.toWei(inputA, 'mwei');
      await usdt.methods.approve(vaultAddress, shareEther).send({ from: account, gasPrice: gasValue});
      toast.success('USDT Approve Success');

      await aaveVault.methods.swapExactToken0ForToken1(usdtAddress, xfiAddress, shareEther, 1, account).send({from: account, gasPrice: gasValue});
      toast.success('Swap Token Success');

      if (connectWallet) {
        connectWallet();
      }

      setIsSwapping(false);
    } catch (error: any) {
      setIsSwapping(false);
      toast.error("Swap token error");
      console.log(error);
    }
  }

  async function swapExactToken0ForToken2_() {
    try {      
      const xxx: any = new _web3.eth.Contract(XFI, xfiAddress);
      const aaveVault = new _web3.eth.Contract(AaveVault, vaultAddress);
      if (parseFloat(inputA) >= parseFloat(reserveMaxXXX)) { // if input value is large than reserve amount
        toast.warn("Overflow XFI reserve amount! Please input value again.");
        return;
      }; 

      let shareEther:any;
      setIsSwapping(true);
      shareEther = _web3.utils.toWei(inputA, 'ether');
      await xxx.methods.approve(vaultAddress, shareEther).send({ from: account, gasPrice: gasValue});
      toast.success('Token Approve Success');
    
      await aaveVault.methods.swapExactToken0ForToken1(xfiAddress, usdtAddress, shareEther, 1, account).send({from: account, gasPrice: gasValue});
      toast.success('Swap Token Success');

      if (connectWallet) {
        connectWallet();
      }

      setIsSwapping(false);
    } catch (error: any) {
      setIsSwapping(false);
      toast.error("Swap token Error");
      console.log(error);
    }
  }

  return (
     <div className="w-[600px] mt-10 m-auto rounded-[20px] h-[580px] border-2 border-gray dark:border-slate-800 dark:bg-slate-800">
        <div className="flex gap-2 border-gray-200 dark:border-gray-900 shadow-md py-3">
          <p className="flex text-2xl font-bold px-5 py-2 text-center dark:text-gray-200 ">
            <button onClick={() => handleIsSwap(true)} 
            className={`flex justify-center rounded-lg py-1 px-5 border border-[#3c50df]
            ${isSwap && 'bg-[#3c50df] text-white'}
            `}>
              Swap
            </button>
          </p>
          {/* <p className="text-xl pl-5 font-bold text-left dark:text-gray-200 py-2">
            <button onClick={() => handleIsSwap(false)} 
            className={`border rounded-lg py-1 px-4 border-[#3c50df] 
            ${!isSwap && 'bg-[#3c50df] text-white'}
            `}>xSwap</button>
          </p> */}
        </div>
        {
          isSwap ?
            (<div>
                <div className="px-5">
                  <InputBox
                    name="inToken"
                    balance={balanceA}
                    value={inputA}
                    options={options}
                    handleCurrentValueChange={handleCurrentValue0Change}
                    onChange={handleInputSwapChange}
                    setMaxAmount={handleMaxAToken}
                  />
                  <InputBox
                    name="outToken"
                    balance={balanceB}
                    value={inputB}
                    options={options2}
                    handleCurrentValueChange={handleCurrentValue1Change}
                    onChange={handleOutputSwapChange}
                    setMaxAmount={handleMaxBToken}
                  />
                </div>
                {/* <div className="p-6">Estimated Gas: <span id="gas_estimate">{gasLimit} ETH</span></div> */}
                <div className="px-5 py-5"></div>
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
                <div className="flex justify-center">
                  {isSwapping?
                  (
                    <SpinnerButton text="Swapping" />
                  ):
                  (
                    <button
                      type="button"
                      className="place-content-center mx-5 w-full py-2 px-10 text-lg font-bold text-white bg-primary rounded-full bg-opacity-85 hover:bg-opacity-90 disabled:bg-indigo-400"
                      disabled={inputA === "0" || inputB === "0"}
                      onClick={handleSwapClick}
                    >
                      {inputA === "0" || inputB === "0"
                        ? "Enter an amount"
                        : "SWAP"}
                    </button>
                  )}
                </div>
            </div>) 
          :
            (<div>
                <div className="px-5">
                  <InputBox
                    name="inputToken"
                    options={options}
                    handleCurrentValueChange={handleCurrentValue0Change}
                    balance={balanceA}
                    onChange={handleInputSwapChange}
                    value={inputA}
                    setMaxAmount={handleMaxAToken}
                  />
                  <InputBox
                    name="outputToken"
                    options={options2}
                    handleCurrentValueChange={handleCurrentValue1Change}
                    balance={balanceB}
                    onChange={handleOutputSwapChange}
                    value={inputB}
                    setMaxAmount={handleMaxBToken}
                  />
                </div>
                <div className="p-5">
                  Estimated Gas: 
                  <span id="gas_estimate">
                    {gasLimit} ETH
                  </span>
                </div>
                <div className="flex justify-center">
                  {isSwapping?
                  (
                    <SpinnerButton text="Swapping" />
                  ):
                  (
                    <button
                      type="button"
                      className="place-content-center mx-5 w-full py-2 px-5 text-lg font-bold text-white bg-primary rounded-full bg-opacity-85 hover:bg-opacity-90 disabled:bg-indigo-400"
                      disabled={inputA === "0" || inputB === "0"}
                      onClick={handleSwapClick}
                    >
                      {inputA === "0" || inputB === "0"
                        ? "Enter an amount"
                        : "SWAP"}
                    </button>
                  )}
                </div>
            </div>)
        }
    </div>
  );
}

export default Swap;