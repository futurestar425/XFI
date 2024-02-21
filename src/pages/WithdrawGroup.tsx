import Button from '../components/Button.js';
import InputBoxLabel from '../components/InputBoxLabel.js';
import SpinnerButton from '../components/SpinnerButton.js';

function WithDrawGroup(props: any) {
  return (
    <div className="sm:container sm:mx-auto sm:px-5 my-10 box-border">
      <div className="box-border h-full w-full">
          <InputBoxLabel
            Token={'xUSDC'}
            balance={props.shareBalance}
            onChange={props.handleShareChange}
            value={props.shareAmount}
            setMaxAmount={props.handleMaxShare}
          />
          <div className="flex mt-20 justify-center">
          {props.isProgressing2?
          (
            <SpinnerButton text="Withdrawing" />
          ):
          (
            <Button text={'Withdraw'} buttonClicked={props.handleWithdrawClick} isDisable={props.isDisable}/>
          )}
        </div>
      </div>
    </div>
  );
}

export default WithDrawGroup;
