import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Web3 from 'web3';
import { Tab, initTE } from 'tw-elements';
import useWallet from "../hooks/useWallet.js";
import { useActiveWeb3 } from '../context/useActiveWeb3.js';
import DepositGroup from './DepositGroup';
import WithdrawGroup from './WithdrawGroup';
import ClaimGroup from './ClaimGroup';
import USDC from '../abi/USDC.json';
import AaveVault from '../abi/AaveVault.json';
import 'react-toastify/dist/ReactToastify.css';
initTE({ Tab });

declare let window: any;

const DepositWithdraw = (props: any) => {
  const { account, isConnected } = useActiveWeb3(); 
  const { vaultAddress, usdcAddress, assetBalance, userReward, shareBalance, xfiVaultBalance, vaultAPY, isPair, connectWallet } = useWallet();

  const [assetAmount, setAssetAmount] = useState('');
  const [shareAmount, setShareAmount] = useState('');
  const [isDisable, setIsDisable] = useState(false);
  const [isTab1Visible, setIsTab1Visible] = useState(true);
  const [isTab2Visible, setIsTab2Visible] = useState(false);
  const [isTab3Visible, setIsTab3Visible] = useState(false);
  const [isProgressing, setIsProgressing] = useState(false);
  const [isProgressing2, setIsProgressing2] = useState(false);
  const [isProgressing3, setIsProgressing3] = useState(false);


    
  const [reward, setReward] = useState(false);

  // useEffect(() => {
  //   if (connectWallet) {
  //     connectWallet();
  //   }
  // }, [reward, userReward]);

  const _web3 = new Web3(window.ethereum);
  const gasValue = _web3.utils.toWei('100', 'gwei');
  const handleTab1Page = () => {
    setIsTab1Visible(true);
    setIsTab2Visible(false);
    setIsTab3Visible(false);
  };

  const handleTab2Page = () => {
    setIsTab2Visible(true);
    setIsTab1Visible(false);
    setIsTab3Visible(false);
  };
  
  const handleTab3Page = () => {
    setIsTab3Visible(true);
    setIsTab1Visible(false);
    setIsTab2Visible(false);
  };

  // this allows to input only float type
  const handleAssetChange = (e: any) => {
    const inputValue = e.target.value;
    if (!/^-?\d*\.?\d*$/.test(inputValue)) {
      // If the input is not a valid float, prevent the change
      e.target.value = inputValue.slice(0, -1);
    }
    setAssetAmount(e.target.value);
  };

  const handleShareChange = (e: any) => {
    const inputValue = e.target.value;
    if (!/^-?\d*\.?\d*$/.test(inputValue)) {
      // If the input is not a valid float, prevent the change
      e.target.value = inputValue.slice(0, -1);
    }
    setShareAmount(e.target.value);
  };

  const handleMaxAsset = () => {
    setAssetAmount(assetBalance);
  };

  const handleMaxShare = () => {
    setShareAmount(shareBalance);
  };

  const handleDepositClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!isConnected) {
      toast.info("Please connect to your wallet");
      return;
    }
    
    if(assetAmount.length <= 0 || parseFloat(shareAmount) <= 0) {
      toast.info("Please enter the deposit amount!");
      return;
    }

    if(parseFloat(assetAmount) > parseFloat(assetBalance)) {
      toast.info("Your account don't have enough funds!");
      return;
    }

    try {
      const usdc: any = new _web3.eth.Contract(USDC, usdcAddress);
      const aaveVault = new _web3.eth.Contract(AaveVault, vaultAddress);
      
      setIsProgressing(true);
      setIsDisable(true);

      const amount = _web3.utils.toWei(assetAmount, 'mwei');
      console.log('vaultAddress', vaultAddress, amount, account);
      await usdc.methods.approve(vaultAddress, amount).send({from: account, gasPrice: gasValue});
      toast.success('USDC Approve Success');

      await aaveVault.methods._deposit(amount, account).send({from: account, gasPrice: gasValue});
      toast.success('USDC Deposit Success');

      if (connectWallet) {
        connectWallet();
      }

      setIsProgressing(false);
      setIsDisable(false);
    } catch (error: any) {
      toast.error("USDC Deposit Failed");
      setIsProgressing(false);
      setIsDisable(false);
      console.log(error);
    }
  };
  
  const handleWithdrawClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    console.log('handleWithdrawClick');

    if (!isConnected) {
      toast.info("Please connect to your wallet");
      return;
    }

    if(parseFloat(shareAmount) > parseFloat(shareBalance)) {
      toast.info("Your account don't have enough funds!");
      return;
    }

    if(parseFloat(shareAmount) <= 0 || shareAmount.length === 0) {
      toast.info("Please enter the withdraw amount!");
      return;
    }
    
    if (connectWallet) {
      await connectWallet();
    }

    try {
      const aaveVault = new _web3.eth.Contract(AaveVault, vaultAddress);

      if (!isPair) {
        toast.info("Please Add Liquidity First");
        return;
      }

      if (parseFloat(xfiVaultBalance.toString()) === 0) {
        toast.info("Please Add XFI to Vault");
        return;
      }

      setIsProgressing2(true);
      setIsDisable(true);

      alert("shareBalance internal function||"+shareBalance+"||"+parseFloat(parseFloat(userReward).toFixed(5)));
      
      if (parseFloat(parseFloat(userReward).toFixed(5)) < 0.0001) {
        toast.info("Your userReward is very low. Please try again 1 hour later!");
        setIsProgressing2(false);
        setIsDisable(false);
        return;
      }

      const withdrawAmount = _web3.utils.toWei(shareAmount, 'mwei');
      await aaveVault.methods.approve(vaultAddress, withdrawAmount).send({from:account, gasPrice: gasValue});
      toast.success('vUSDC Approve Success');
      const gasValue1 = _web3.utils.toWei('20', 'gwei');
      await aaveVault.methods._withdraw(withdrawAmount, account).send({from:account, gasPrice: gasValue1});
      toast.success('Withdraw USDC Success');
      const start = new Date();
      const startTime = Math.floor(start.getTime());
      setTimeout( async() => {
        if (connectWallet) {
          alert("connectWallet internal!!!!!!!!!!");

          await connectWallet();
        }
      }, 1000);
      const second = new Date();
      const secondTime = Math.floor(second.getTime());
      const time = secondTime-startTime;
      alert("time"+time);
      setIsProgressing2(false);
      setIsDisable(false);
    } catch (e: any) {
      toast.error("Withdraw USDC Failed");
      setIsProgressing2(false);
      setIsDisable(false);
      console.log(e);
    }

  };

  const handleClaimClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!isConnected) {
      toast.info("Please connect to your wallet");
      return;
    }

    try {
      const aaveVault = new _web3.eth.Contract(AaveVault, vaultAddress);
      
      if (!isPair) {
        toast.info("Please Add Liquidity First");
        return;
      }

      if (parseFloat(xfiVaultBalance.toString()) === 0) {
        toast.info("Please Add XFI to Vault");
        return;
      }
      alert(parseFloat(parseFloat(userReward).toFixed(10)));
      if (parseFloat(parseFloat(userReward).toFixed(10)) < 0.0001) {
        toast.info("Your userReward is very low. Please try again 1 hour later!");
        return;
      }

      setIsProgressing3(true);
      setIsDisable(true);
      console.log("aaveVault", aaveVault);
      await aaveVault.methods.claim(account).send({from:account, gasPrice: gasValue});
      toast.success('Claim Success');
      
      if (connectWallet) {
        connectWallet();
      }
      
      setIsProgressing3(false);
      setIsDisable(false);
    } catch (e: any) {
      toast.error("Claim Failed");
      setIsProgressing3(false);
      setIsDisable(false);
      console.log(e);
    }
  };


  return (
    <div className='w-full h-[530px] bg-white flex m-auto flex-row flex-wrap border-2 border-gray rounded-[20px] pl-0'>
      <ul
        className="w-full flex list-none flex-row flex-wrap border-b-0 pl-0"
        role="tablist"
        data-te-nav-ref
      >
        <li role="presentation" className="flex-auto mb-0 w-1/3 h-1/20 text-center">
          <button
          className={`${isTab1Visible && 'bg-black/10'} border-b-2 border-gray text-black rounded-tl-[12px] border-t-0 w-[100%] h-15 text-2xl leading-tight active:isolate data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary`}
          onClick={handleTab1Page}
          >
            Deposit 
            {`${isPair}`} {userReward} {isDisable} {isProgressing} {assetBalance} {assetAmount}
          </button>
        </li>
        <li role="presentation" className="flex-auto mb-0 w-1/3 text-center">
          <button
          className={`${isTab2Visible && 'bg-black/10'} text-black border-l-2 border-r-2 border-b-2 border-gray w-[100%] h-15 text-2xl leading-tight data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary`}
          onClick={handleTab2Page}
          >
            Withdraw {reward}
          </button>
        </li>
        <li role="presentation" className="flex-auto mb-0 w-1/3 text-center">
          <button
          className={`${isTab3Visible && 'bg-black/10'} text-black rounded-tr-[12px] border-t-0 border-b-2 border-gray w-[100%] h-15 text-2xl leading-tight data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary`}
          onClick={handleTab3Page}
          >
            Claim
          </button>
        </li>
      </ul>
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
      <div className="mx-auto justify-center items-center">
        {isTab1Visible &&
          <DepositGroup
            handleAssetChange={handleAssetChange}
            handleDepositClick={handleDepositClick}
            assetBalance={assetBalance}
            assetAmount={assetAmount}
            handleMaxAsset={handleMaxAsset}
            isDisable={isDisable}
            isProgressing={isProgressing}
          />
        }
        {isTab2Visible &&
          <WithdrawGroup
            handleShareChange={handleShareChange}
            handleWithdrawClick={handleWithdrawClick}
            shareBalance={shareBalance}
            shareAmount={shareAmount}
            handleMaxShare={handleMaxShare}
            isDisable={isDisable}
            isProgressing2={isProgressing2}
          />
        }
        {isTab3Visible &&
          <ClaimGroup
            handleInputChange={props.handleInputChange}
            handleClaimClick={handleClaimClick}
            vaultAPY={vaultAPY}
            userReward={parseFloat(userReward).toFixed(10)}
            isDisable={isDisable}
            isProgressing3={isProgressing3}
          />
        }
      </div>
    </div>
  );
};

export default DepositWithdraw;
