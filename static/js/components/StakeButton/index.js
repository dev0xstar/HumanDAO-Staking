import React, { useState } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import Toast from 'react-bootstrap/Toast'
import { ethers } from 'ethers'
import { useContractFunction } from '@usedapp/core'

function StakeButton(props) {
  const [show, setShow] = useState(false)
  const [txns, setTxns] = useState([])

  const signer = props.library.getSigner()
  let contract = new ethers.Contract(props.stakedAddress, props.abis.stakingPool, signer)
  const { state, send } = useContractFunction(contract, 'deposit', { transactionName: 'Deposit' })

  const onStakePressed = async () => {
    // handle blank
    if(props.amount === '') return;
    const durationSec = props.duration

    // handle good input
    const fmtAmount = ethers.utils.parseEther(props.amount.toString())
    send(fmtAmount, durationSec, props.account)
    return true;
  };

  if(!txns.includes(state?.transaction?.hash) && state.status === 'Success') {
    setTxns([...txns, state.transaction.hash])
    setShow(true)
  }

  return (
    <>
      <button
        type="button"
        className="connect-btn w-3/6 my-2"
        onClick={onStakePressed}
        disabled={state.status === 'Mining'}
      >
        {state.status === 'Mining' ?
            <Spinner size="sm" animation="border" role="status">
              <span className="visually-hidden">"In progress..."</span>
            </Spinner>
          :
            "Stake"
        }
      </button>
      {state.status === 'Success' ?
        <Toast className="w-full shadow-none" onClose={() => setShow(false)} show={show} delay={5000} autohide>
          <Toast.Body className="p-0 text-sm bg-green-200">
            Transaction successful
          </Toast.Body>
        </Toast>
        :
        <></>
      }
      {state.status === 'Fail' ?
        <Toast className="w-full shadow-none" onClose={() => setShow(false)} show={show} delay={5000} autohide>
          <Toast.Body className="p-0 text-sm bg-red-300">
            Transaction failed
          </Toast.Body>
        </Toast>
        :
        <></>
      }
    </>
  )
}

export default StakeButton;
