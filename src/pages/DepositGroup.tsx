import Button from '../components/Button.js';
import InputBoxLabel from '../components/InputBoxLabel.js';
import SpinnerButton from '../components/SpinnerButton.js';

function DepositGroup(props: any) {
  return (
    <div className="sm:container sm:mx-auto sm:px-5 my-10 box-border">
      <div className="box-border h-full w-full">
        <InputBoxLabel
          Token={'USDC'}
          balance={props.assetBalance}
          onChange={props.handleAssetChange}
          value={props.assetAmount}
          setMaxAmount={props.handleMaxAsset}
        />
        <div className="flex flex-row mt-20 px-7 pt-3 justify-center items-center">
        {props.isProgressing?
          (
            <SpinnerButton text="Depositing" />
          ):
          (
            <Button text={'Deposit'} buttonClicked={props.handleDepositClick} isDisable={props.isDisable}/>
          )}
        </div>
      </div>
    </div>
  );
}

export default DepositGroup;