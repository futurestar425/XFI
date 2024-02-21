import React from "react";
import { useState } from "react";
import { FaEthereum } from "react-icons/fa";

interface TableRow {
  id: number;
  network: string;
  name: string;
  wallet: number;
  deposited: number;
  apy: string;
  tvl: string;
}

const EarnButtons = () => {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [isClick, setIsClick] = useState(false);

  const buttonClasses = `text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 ${
    isClick ? 'dark:bg-blue-700 dark:text-white dark:border-blue-500 dark:hover:text-white dark:focus:ring-blue-800' : ''
  }`;

  const handleButtonClick = (buttonRows: TableRow[]) => {
    setRows((prevRows) => {
      setIsClick((prevIsClick) => !prevIsClick);
      const isDisplayed = buttonRows.every((row) =>
        prevRows.some((prevRows) => prevRows.id === row.id)
      );
      if(isDisplayed){
        return prevRows.filter(
          (prevRows) => !buttonRows.some((row) => row.id === prevRows.id)
        );
      }
      return [...prevRows, ...buttonRows];
    });
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <button
            id="etherBtn" 
            type="button" 
            onClick={() => 
              handleButtonClick([
                {id:1, network: 'eth', name: 'SPC-WETH vLP - 1', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'},
                {id:2, network: 'eth', name: 'SPC-WETH vLP - 2', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'}
                ])
            } 
            className={buttonClasses}
          >
            <FaEthereum className="w-12 h-6"/>
          </button>
          <button 
            id="polygonBtn"
            type="button" 
            onClick={() => 
              handleButtonClick([
                {id:3, network: 'polygon', name: 'USDC-USDR sLP - 1', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'},
                {id:4, network: 'polygon', name: 'USDC-USDR sLP - 2', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'}
                ])
            } 
            className={buttonClasses}
          >
            <img src="polygon.png" className="w-6 h-6 mr-3 ml-3"/>
          </button>
          <button type="button" className={buttonClasses}>
            <FaEthereum className="w-12 h-6"/>
          </button>
          <button type="button" className={buttonClasses}>
            <FaEthereum className="w-12 h-6"/>
          </button>
          <button type="button" className={buttonClasses}>
            <FaEthereum className="w-12 h-6"/>
          </button>
          <button type="button" className={buttonClasses}>
            <FaEthereum className="w-12 h-6"/>
          </button>
        </div>
        
        <button type="button" onClick={() => 
              handleButtonClick([
                {id:1, network: 'eth', name: 'SPC-WETH vLP - 1', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'},
                {id:2, network: 'eth', name: 'SPC-WETH vLP - 2', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'},
                {id:3, network: 'polygon', name: 'USDC-USDR sLP - 1', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'},
                {id:4, network: 'polygon', name: 'USDC-USDR sLP - 2', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'}
                ])
            }  className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500 ml-auto">
          Clear All
        </button>
      </div>
    </>
  );
};

export default EarnButtons;