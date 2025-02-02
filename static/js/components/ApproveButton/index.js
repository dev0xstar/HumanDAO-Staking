import React from 'react';
import Spinner from 'react-bootstrap/Spinner'
import { ethers } from 'ethers';
import { useContractFunction } from '@usedapp/core';
import { MAX_APPROVAL } from '../../utils/constants';

function ApproveButton(props) {
  const signer = props.library.getSigner()
  let contract = new ethers.Contract(props.tokenAddress, props.abis.erc20, signer)
  const { state, send } = useContractFunction(contract, 'approve', { transactionName: 'Approve' })

  const onApprovePressed = async () => {
    send(props.stakedAddress, MAX_APPROVAL)
  };

  return (
    <>
      <button
        type="button"
        className="connect-btn w-3/6 my-2"
        onClick={onApprovePressed}
        disabled={state.status === 'Mining'}
      >
        {state.status === 'Mining' ?
          <Spinner size="sm" animation="border" role="status">
            <span className="visually-hidden">"In progress..."</span>
          </Spinner>
          :
          "Approve"
        }
      </button>
    </>
  )
}

export default ApproveButton;
