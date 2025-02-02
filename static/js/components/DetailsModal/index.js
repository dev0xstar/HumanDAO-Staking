import React from 'react';
import { Link } from "react-router-dom";
import { formatMoney, formatPct } from '../../utils/strings';
import Modal from 'react-bootstrap/Modal'

// components
import TokenLogo from '../TokenLogo';

function DetailsModal(props) {
  return (
    <Modal centered size="lg" show={props.show} onHide={props.onHide}>
      <Modal.Body>
        <p className="font-black pb-3 text-2xl">{props.title}</p>
        <div className="grid grid-cols-2 px-8 mb-2">
          <p className="text-left">TVL</p>
          <p>{((props.tvl >= 0) && formatMoney(props.tvl)) || "..."} </p>
          <p className="text-left"> APR </p>
          <p>{((props.apr >= 0) && formatPct(props.apr)) || "..."} </p>
          <p className="text-left">Your Deposits</p>
          <p>
            <span className="flex flex-row justify-center items-center">
              <props.DepositLogo /> {props.totalDeposits} ({formatMoney(props.totalDeposits * props.depositPrice)})
            </span>
          </p>
          <p className="text-left">Your Unclaimed Rewards</p>
          <p>
            <span className="flex flex-row justify-center items-center">
              <TokenLogo /> {props.pendingRewards} ({formatMoney(props.pendingRewards * props.hdaoPrice)})
            </span>
          </p>
        </div>
        <Link className="connect-btn" to="/rewards" >Claim</Link>
      </Modal.Body>
    </Modal>
  )
}

export default DetailsModal;
