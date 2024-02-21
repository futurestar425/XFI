  import React from "react";
import DropDown from "./DropDown";

interface InputBoxProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: string[];
  balance: string;
  handleCurrentValueChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  setMaxAmount: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ name, value, onChange, options, balance, handleCurrentValueChange, setMaxAmount }) => {
  return (
    <div className="grid grid-cols-3 gap-5 mt-12"> 
      <div className="col-span-2"> 
        <div className="mx-auto"> 
          <input 
            type="text" 
            minLength={1} 
            maxLength={20} 
            inputMode="decimal" 
            name={name} 
            value={value} 
            placeholder="0" 
            className="py-3 pl-3 text-xl rounded-[20px] w-full bg-gray/50 border border-black/5 outline-none" 
            onFocus={(e) => e.target.select()} 
            onChange={onChange} 
          /> 
        </div> 
      </div> 
      <div className="col-span-1 mx-auto">
        <DropDown options={options} onChange={handleCurrentValueChange}  /> 
        <div className="text-center mt-3">
          <span className="pt-3 text-center font-medium">Balance: {balance}</span>
          <button className="text-xs text-white mx-2 px-2 py-1 bg-primary rounded-xl" onClick={setMaxAmount}>MAX</button>
        </div>
      </div>
    </div> 
  );
}

export default InputBox;
