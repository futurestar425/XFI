function Button(props: any) {
  return (
    <div className="flex">
      <button
        className={`rounded-full px-3.5 py-2.5 text-lg font-semibold shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-48 ${props.isDisable ? 'bg-gray-800 border cursor-not-allowed' : 'bg-primary text-white'}`}
        onClick={props.buttonClicked}
        disabled={props.isDisable}
      >
        {props.text}
      </button>
    </div>
  );
}

export default Button;