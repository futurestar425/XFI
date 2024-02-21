import React from "react";

interface InputBoxLiquidityProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  balance: string;
  token: string;
  setMaxAmount: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const InputBoxLiquidity: React.FC<InputBoxLiquidityProps> = ({ name, value, onChange, balance, token, setMaxAmount }) => {
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
        <div className="py-3 pl-5 bg-black/5 text-xl rounded-[20px] w-full shadow-lg">{token}</div> 
        <div className="text-center mt-3">
          <span className="pt-3 text-center font-medium">Balance: {balance}</span>
          <button className="text-xs text-white ml-2 px-2 py-1 bg-primary rounded-xl" onClick={setMaxAmount}>MAX</button>
        </div>
      </div>
    </div> 
  );
}

export default InputBoxLiquidity;
