import React from 'react';
import Spinner from 'react-bootstrap/Spinner'
import { ethers } from 'ethers';
import { useContractFunction } from '@usedapp/core'

function WithdrawButton(props) {
  const signer = props.library.getSigner()
  let contract = new ethers.Contract(props.stakedAddress, props.abis.stakingPool, signer)
  const { state, send } = useContractFunction(contract, 'withdraw', { transactionName: 'Withdraw' })

  const onWithdrawPressed = async () => {
    send(props.depositId, props.account)
  };

  return (
    <>
      <button
        type="button"
        className="btn-lt btn-lt-secondary w-full my-2"
        onClick={onWithdrawPressed}
        disabled={props.disabled || state.status === 'Mining'}
      >
        {state.status === 'Mining' ?
          <Spinner size="sm" animation="border" role="status">
            <span className="visually-hidden">"In progress..."</span>
          </Spinner>
          :
          props.disabled ? "Locked" : "Withdraw"
        }
      </button>
    </>
  )
}

export default WithdrawButton;
