import React from 'react';
import Spinner from 'react-bootstrap/Spinner'
import { ethers } from 'ethers';
import { useContractFunction } from '@usedapp/core'

function ClaimButton(props) {
  const signer = props.library.getSigner()
  let contract = new ethers.Contract(props.stakedAddress, props.abis.stakingPool, signer)
  const { state, send } = useContractFunction(contract, 'claimRewards', { transactionName: 'Claim rewards' })

  const onClaimPressed = async () => {
    send(props.account)
  };

  return (
    <>
      <button
        type="button"
        className="btn-lt btn-lt-secondary text-center my-2"
        onClick={onClaimPressed}
        disabled={props.disabled || state.status === 'Mining'}
      >
        {state.status === 'Mining' ?
          <Spinner size="sm" animation="border" role="status">
            <span className="visually-hidden">"In progress..."</span>
          </Spinner>
          :
          "Start Vesting"
        }
      </button>
    </>
  )
}

export default ClaimButton;
