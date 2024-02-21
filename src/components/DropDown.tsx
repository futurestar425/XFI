import React from 'react';
import { Dropdown, Ripple, initTE } from 'tw-elements';

initTE({ Dropdown, Ripple });

interface DropDownProps {
  options: string[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const DropDown: React.FC<DropDownProps> = ({ options, onChange}) => {
  return (
    <div className="text-md" data-te-dropdown-ref>
      <select
        onChange={onChange}
        className="fx items-center w-full whitespace-nowrap rounded-[20px] pl-4 pr-4 py-3.5 text-lg font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] motion-reduce:transition-none"
        id="dropdownMenuButton1"
        data-te-dropdown-toggle-ref
        aria-expanded="false"
        data-te-ripple-init
        data-te-ripple-color="dark"
      >
        {options.map((option, index) => (
          <option key={index} value={index} className="block rounded-[20px] w-full whitespace-nowrap bg-transparent px-6 text-md font-normal text-neutral-700 hover:bg-neutral-100 active:te xt-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600">
            {option}
          </option>
        ))}
        </select>
    </div>
  );
}

export default DropDown;
