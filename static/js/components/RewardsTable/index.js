import React, { useState } from 'react';
import Table from 'react-bootstrap/Table'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

// components
import TokenLogo from '../../components/TokenLogo'
import WithdrawButton from '../WithdrawButton';

function RewardsTable(props) {
  const rewards = props.pendingRewards

  return (
    <div className="card w-5/6 md:w-4/5 lg:w-4/6">
      <p className="text-2xl font-black">
        VESTING REWARDS
      </p>
      {rewards.length > 0 ?
        <Table responsive className="text-center align-middle">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Vesting Start</th>
              <th>Time to Unlock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              rewards.map((reward, rewardId) => {
                return (
                  <tr key={rewardId}>
                    <td className="text-left">
                      <span className="flex flex-row items-center">
                        <TokenLogo />
                        <p>{reward.amount}</p>
                      </span>
                    </td>
                    <td>{ reward.depositTimeFmt }</td>
                    <td>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={(
                          <Tooltip>
                            <p>{reward.lockedUntilFmt}</p>
                          </Tooltip>
                        )}
                        >
                        <div>{ reward.lockedUntilClean }</div>
                      </OverlayTrigger>
                    </td>
                    <td>
                      <WithdrawButton {...props} depositId={rewardId} disabled={reward.lockedUntilRaw > Date.now()} />
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      :
        <p className="mt-2 text-lg">You have not claimed any staking rewards</p>
      }
    </div>
  )
}

export default RewardsTable;