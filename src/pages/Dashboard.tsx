import useWallet from "../hooks/useWallet.js";
import Earn from './Earn.js';
import CardOne from '../components/CardOne.js';
import CardTwo from '../components/CardTwo.js';
import CardThree from '../components/CardThree.js';
import CardFour from '../components/CardFour.js';
import ChartThree1 from '../components/ChartThree1.js';
import ChartThree2 from '../components/ChartThree2.js';
import ChartThree3 from '../components/ChartThree3.js';

const Dashboard = () => {
  const { shareBalance, userReward } = useWallet();

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne shareBalance = {shareBalance}/>
        <CardTwo />
        <CardThree userReward = {parseFloat(userReward).toFixed(3)} />
        <CardFour dailyReward = {(parseFloat(userReward)/365).toFixed(3)}/>
      </div>
      <div className='border-t mt-4'>
      <p className='mt-4 text-[25px] font-bold'>Overview</p>
      <div className="grid mt-4 grid-cols-3 gap-4 md:grid-cols-1 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <ChartThree1 />
        <ChartThree2 />
        <ChartThree3 />
      </div>
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-12">
          <Earn />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
