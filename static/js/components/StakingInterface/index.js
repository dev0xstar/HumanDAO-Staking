import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form';

// components
import StakeButton from '../StakeButton';
import ApproveButton from '../ApproveButton';
import { formatPct } from '../../utils/strings';

function durationToMonths(duration) {
  const durationMonths = (duration / (60*60*24*365)) * 12
  return durationMonths
}

function durationToMultiplier(duration) {
  const multiplier = ((duration + 47304000) / 47304000)
  return multiplier
}

function StakingInterface(props) {
  let [showLock, setShowLock] = useState(true);
  let [depositAmount, setDepositAmount] = useState('');
  let [duration, setDuration] = useState(0);

  // check if approved
  const isApproved = props.tokenApproval && (depositAmount <= props.tokenApproval)

  const handleDurationChange = (event) => {
    // handle number
    let newAmount = parseFloat(event.target.value)
    setDuration(newAmount)
  }

  const handleDepositAmountChange = (event) => {
    // handle blank
    if (event.target.value === '') setDepositAmount('')

    // handle number
    let newAmount = parseFloat(event.target.value)
    if(newAmount <= props.tokenBalance) {
      setDepositAmount(newAmount)
    } else {
      // throw an error
    }
  }

  function handleDepositMax() {
    if (!isApproved) return
    setDepositAmount(props.tokenBalance)
  }

  function handleSelectLocked(eventKey) {
    if(eventKey === "locked") {
      setShowLock(true)
    } else {
      setDuration(0)
      setShowLock(false)
    }
  }

  return (
    <>
      <div className="">
        <p className="text-2xl">
          {props.title}
        </p>
        <div className="flex flex-col items-center w-full px-8">
          <Form className="flex flex-col items-center w-full">
            <Nav
              className="w-full mt-2 mb-2 grid grid-cols-2 gap-1 text-center"
              variant="pills"
              defaultActiveKey="locked"
              onSelect={handleSelectLocked}
            >
              <Nav.Item>
                <Nav.Link className="btn-flex" eventKey="locked" >Locked</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className="btn-flex" eventKey="flexible" >Flexible</Nav.Link>
              </Nav.Item>
            </Nav>
            <div className={"w-full" + (!showLock ? " invisible" : "")}>
              <div className="flex flex-row justify-between">
                <p className="text-sm">
                  Locked for {durationToMonths(duration)} months
                </p>
                <p className="text-sm">
                  Multiplier: {durationToMultiplier(duration).toFixed(2) }x
                </p>
              </div>
              <Form.Range value={duration} max={47304000} step={15768000} onChange={handleDurationChange} />
            </div>

            <div className="w-full">
              <p className="text-md py-2 text-center">
                Estimated APR: <span className="font-black ml-2">{(props.apr && formatPct(props.apr * (durationToMultiplier(duration) / 2))) || "..."}</span>
              </p>
            </div>

            <div className="w-full mb-2">
              <p className="text-sm text-right">
                Balance: {parseFloat(props.tokenBalance).toFixed(2)}
              </p>
              <div className="flex flex-row items-center">
                <Form.Control
                  placeholder={isApproved ? "0.0" : "Approve token to stake"}
                  value={depositAmount}
                  disabled={!isApproved}
                  onChange={handleDepositAmountChange}
                />
                <p className="text-sm -ml-8 hover:underline cursor-pointer unselectable" onClick={handleDepositMax} >Max</p>
              </div>
              <p className="text-base text-center">
                *Remember to claim your <a className="text-base underline hover:text-black" href="https://bonus.humandao.org/" target="_blank" rel="noreferrer">bonus</a> before staking
              </p>
            </div>
            {
              !isApproved ?
                <ApproveButton {...props} />
              :
                <StakeButton {...props} amount={depositAmount} duration={duration} />
            }
          </Form>
        </div>
      </div>
    </>
  )
}

export default StakingInterface;