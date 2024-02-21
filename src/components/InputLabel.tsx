function InputLabel() {
  return (
    <div className="flex p-3 mb-5 mt-10 bg-blue-200 mx-0 items-center sm:container sm:mx-auto sm:px-5 rounded-2xl border-2 border-gray box-border">
      <div className="flex-auto items-center">
        <label className="flex justify-between">
          <span>USDC Reward:</span>
          <span>15%</span>
        </label>
        <label className="pt-5 flex justify-between">
          <span>XFI Reward:</span>
          <span>85%</span>
        </label>
      </div>
    </div>
  );
}

export default InputLabel;
