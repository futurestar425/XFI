function InputBoxLabel(props: any) {
  const tokenBalance = parseFloat(props.balance).toFixed(3);
  
  return (
    <div className="flex mb-5 justify-between pt-4 pb-4 items-center bg-blue-200 sm:container sm:mx-auto sm:px-4 rounded-2xl border-2 border-gray box-border">
      <div className="flex-auto justify-center items-center">
        <input
          type="text"
          name={props.name}
          value={props.value}
          placeholder="0"
          className="p-2 pl-5 bg-blue-200 text-3xl rounded-[20px] w-3/5 focus:bg-black/5 outline-none"
          onChange={props.onChange}
        />
        {props.isEmpty ? (
          <p className="mt-2 text-sm text-red-600">
            {props.name}
          </p>
        ) : (
          <p></p>
        )}
      </div>
      <div className="my-2 ml-[-120px]">
        <div className="font-bold text-2xl">
          {props.Token}
        </div>
        <div className="text-center">
          <span className="font-medium">Balance: {tokenBalance}</span>
          <button className="text-xs text-white ml-2 p-1 bg-primary rounded-xl" onClick={props.setMaxAmount}>MAX</button>
        </div>
      </div>
    </div>
  );
}

export default InputBoxLabel;
