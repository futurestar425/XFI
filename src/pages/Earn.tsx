import React, { useEffect, useState } from "react";
import { FaEthereum } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useWallet from "../hooks/useWallet.js";

interface TableRow {
  id: number;
  network: string;
  name: string;
  wallet: number;
  deposited: string;
  apy: string;
  tvl: string;
}
interface TableProps {
  rows: TableRow[];
  onRowClick: (row: TableRow) => void;
  searchQuery: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EarnTable: React.FC<TableProps> = ({ rows, onRowClick, searchQuery, handleSearchChange }) => {
  
  const sortedRows = [...rows].sort((a, b) => a.id - b.id);
  const handleRowClick = (row: TableRow) => {
    onRowClick(row);
  }

  return (
     <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 cursor-pointer">
          <thead className="text-xs text-gray-700 uppercase bg-gray dark:bg-gray-700 dark:text-gray-400">
              <tr>
                  <th scope="col" className="p-4 w-2">
                    Network
                  </th>
                  <th scope="col" className="px-6 py-3 w-10">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                          </svg>
                      </div>
                      <input type="text" value={searchQuery} onChange={handleSearchChange} id="table-search-users" className="block p-2 pl-10 text-sm text-gray-900 border border-gray rounded-lg w-80 bg-gray-50 focus:ring-gray focus:border-gray dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                      WALLET
                  </th>
                  <th scope="col" className="px-6 py-3">
                      DEPOSITED
                  </th>
                  <th scope="col" className="px-6 py-3">
                      APY
                  </th>
                  <th scope="col" className="px-6 py-3">
                      TVL
                  </th>
              </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr key={row.id} onClick={() => handleRowClick(row)} className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="w-2 p-4">
                  {row.network === 'eth' && <FaEthereum className="w-6 h-6 mr-2" />}
                  {row.network === 'polygon' && <img src="polygon.png" className="w-6 h-6 mr-2" />}
                  {row.network === 'bnb' && <img src="bnb.png" className="w-6 h-6 mr-2" />}
                  {row.network === 'fantom' && <img src="fantom.png" className="w-6 h-6 mr-2" />}
                  {row.network === 'arbitrum' && <img src="arbitrum.png" className="w-6 h-6 mr-2" />}
                  {row.network === 'cronos' && <img src="cronos.png" className="w-6 h-6 mr-2" />}
                </td>
                <th className="text-base font-semibold text-center">{row.name}</th>
                <td className="w-8 p-4 text-center">{row.wallet}</td>
                <td className="w-8 p-4">{row.deposited}</td>
                <td className="w-8 p-4">{row.apy}</td>
                <td className="w-8 p-4">{row.tvl}</td>
              </tr>
            ))}
          </tbody>
      </table>
  )
}

const Earn = () => {
  const { vaultAPY, shareBalance, totalValueLocked } = useWallet();
  const [rows, setRows] = useState<TableRow[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const initialRows: TableRow[] = Object.values(rowMap);
    setRows(initialRows);
  }, [shareBalance, totalValueLocked]);

  const handleRowClick = (row: TableRow) => {
    navigate('/vault');
  }
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }
  
  const filteredRows = rows.filter(row =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const [buttonClicked, setButtonClicked] = useState<{ [key: string]: boolean }>({
    etherBtn: false,
    polygonBtn: false,
    bnbBtn: false,
    fantomBtn: false,
    arbitrumBtn: false,
    cronosBtn: false
  });
  
  const handleButtonClick = (buttonId: string, buttonRows: TableRow[]) => {
    if (buttonId === "clearBtn") {
      setIsAllSelected(true)
      setButtonClicked((prevState: { [key: string]: boolean }) => {
        const updatedState: { [key: string]: boolean } = {};
        Object.keys(prevState).forEach((key) => {
          updatedState[key] = false;
        });
        return updatedState;
      });
      setRows(buttonRows);
      return;
    }

    setButtonClicked((prevState: { [key: string]: boolean }) => {
      if (isAllSelected) {
        const updatedState: { [key: string]: boolean } = {};
        Object.keys(prevState).forEach((key) => {
          if (key === buttonId) {
            updatedState[key] = prevState[key];
          } else {
            updatedState[key] = true;
          }
        });
        return updatedState;
      } else {
        return {
          ...prevState,
          [buttonId]: !prevState[buttonId]
        };
      }
    });

    setRows((prevRows) => {
      if(isAllSelected){
        return buttonRows;
      } else {
        const isDisplayed = buttonRows.every((row) =>
          prevRows.some((prevRows) => prevRows.id === row.id)
        );
        if(isDisplayed){
          return prevRows.filter(
            (prevRows) => !buttonRows.some((row) => row.id === prevRows.id)
          );
        }
        return [...prevRows, ...buttonRows];
      }
    });
    setIsAllSelected(false);
  };

  const rowMap: { [key: number]: TableRow } = {
    1: { id: 1, network: 'eth', name: 'USDC xLP', wallet: 0, deposited: `${shareBalance}`, apy: `${vaultAPY}%`, tvl: `$${totalValueLocked}` },
    // 2: { id: 2, network: 'eth', name: 'SPC-WETH vLP - 2', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M' },
    // 3: { id: 3, network: 'polygon', name: 'USDC-MATIC vLP - 1', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M' },
    // 4: { id: 4, network: 'polygon', name: 'USDC-MATIC vLP - 2', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M' },
    // 5: {id:5, network: 'bnb', name: 'CAKE-BNB sLP - 1', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'},
    // 6: {id:6, network: 'bnb', name: 'CAKE-BNB sLP - 2', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'},
    // 7: {id:7, network: 'fantom', name: 'USDC-FTM sLP - 1', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'},
    // 8: {id:8, network: 'fantom', name: 'USDC-USDR sLP - 2', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'},
    // 9: {id:9, network: 'arbitrum', name: 'USDC-USDR sLP - 1', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'},
    // 10: {id:10, network: 'arbitrum', name: 'USDC-USDR sLP - 2', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'},
    // 11: {id:11, network: 'cronos', name: 'USDC-USDR sLP - 1', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'},
    // 12: {id:12, network: 'cronos', name: 'USDC-USDR sLP - 2', wallet: 0, deposited: 0, apy: '41.65%', tvl: '$7.54M'}
  };
  
  const buttons = [
    { id: 'etherBtn', label: <FaEthereum className="w-12 h-6" />, data: [rowMap[1]]},
    { id: 'polygonBtn', label: <img src="polygon.png" className="w-6 h-6 mr-3 ml-3" />, data: []},
    { id: 'bnbBtn', label: <img src="bnb.png" className="w-6 h-6 mr-3 ml-3" />, data: []},
    { id: 'fantomBtn', label: <img src="fantom.png" className="w-6 h-6 mr-3 ml-3" />, data: []},
    { id: 'arbitrumBtn', label: <img src="arbitrum.png" className="w-6 h-6 mr-3 ml-3" />, data: []},
    { id: 'cronosBtn', label: <img src="cronos.png" className="w-6 h-6 mr-3 ml-3" />, data: []}
  ];

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div>
          {buttons.map((button) => (
            <button
              key={button.id}
              className={`border border-blue-700 hover:bg-blue-700 hover:text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500 ml-auto bg-secondary${
                buttonClicked[button.id] ? 'bg-secondary' : ''
              }`}
              onClick={() => handleButtonClick(button.id, button.data)}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4 flex justify-between items-center">
          <div className="font-medium border rounded-lg px-2 inliine-flex">
            <button className="hover:text-black text-sm p-2.5 text-center mx-2">
              All Vaults
            </button>
            <button className="hover:text-black text-sm p-2.5 text-center mx-2">
              Saved Vaults
            </button>
            <button className="hover:text-black text-sm p-2.5 text-center mx-2">
              My Vaults
            </button>
          </div>
          <div className="font-medium border rounded-lg px-2 mx-2">
            <button className="hover:text-black text-sm p-2.5 text-center mx-2">
              Featured
            </button>
            <button className="hover:text-black text-sm p-2.5 text-center mx-2">
              StableCoins
            </button>
            <button className="hover:text-black text-sm p-2.5 text-center mx-2">
              Blue Chip
            </button>
            <button className="hover:text-black text-sm p-2.5 text-center mx-2">
              XFI Vaults
            </button>
            <button className="hover:text-black text-sm p-2.5 text-center mx-2">
              Correlated
            </button>
          </div>

          <div className="font-medium inline-flex">
            <div className="border rounded-lg px-2">
              <button className="hover:text-black text-sm p-2.5 text-center mx-2">
                Single
              </button>
              <button className="hover:text-black text-sm p-2.5 text-center mx-2">
                LP
              </button>
            </div>
            <div className="mx-4 border rounded-lg px-2">
              <button className="hover:text-black text-sm p-2.5 text-center inline-flex mx-2">
                Filters
              </button>
            </div>
            <button 
              id="clearBtn"
              type="button"
              onClick={() => handleButtonClick('clearBtn', Object.values(rowMap)) }  
              className="ml-4 border rounded-lg hover:text-black focus:ring-4 focus:outline-none text-sm p-2.5 text-center inline-flex">
              Clear All
            </button>
          </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg border">
        <EarnTable rows={filteredRows} onRowClick={handleRowClick} searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      </div>
    </>
  );
};
export default Earn;