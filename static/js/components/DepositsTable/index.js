import React, { useState } from 'react';
import Table from 'react-bootstrap/Table'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

// components
import TokenLogo from '../../components/TokenLogo'
import LpLogo from '../../components/LpLogo'
import WithdrawButton from '../WithdrawButton';

function DepositsTable(props) {
  const deposits = props.deposits

  return (
    <>
      <div className="card w-5/6 md:w-4/5 lg:w-4/6">
        <p className="text-2xl font-black">
          {props.title}
        </p>
        {deposits.length > 0 ?
          <Table responsive className="text-center align-middle">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Deposit Time</th>
                <th>Time to Unlock</th>
                <th>Multiplier</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                deposits.map((deposit, depositId) => {
                  return (
                    <tr key={depositId}>
                      <td className="text-left">
                        <span className="flex flex-row items-center">
                          {props.stakingType === 'single' ? <TokenLogo /> :
                           props.stakingType === 'lp' ? <LpLogo /> : <></>
                          }
                          <p>{deposit.amount}</p>
                        </span>
                      </td>
                      <td>{ deposit.depositTimeFmt }</td>
                      <td>
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={(
                            <Tooltip>
                              <p>{deposit.lockedUntilFmt}</p>
                            </Tooltip>
                          )}
                        >
                          <div>{deposit.lockedUntilClean}</div>
                        </OverlayTrigger>
                      </td>
                      <td>{ deposit.multiplier }</td>
                      <td>
                        <WithdrawButton {...props} depositId={depositId} disabled={deposit.lockedUntilRaw > Date.now()} />
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        :
          <p className="mt-2 text-lg">You do not have any deposits in this pool</p>
        }
      </div>
    </>
  )
}

export default DepositsTable;