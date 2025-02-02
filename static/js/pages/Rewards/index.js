import React from 'react';
import Table from 'react-bootstrap/Table';
import { fadeIn } from '../../utils/springs';
import { useSpring, animated } from "react-spring";

// components
import ClaimButton from '../../components/ClaimButton'
import RewardsTable from '../../components/RewardsTable'
import TokenLogo from '../../components/TokenLogo'
import LpLogo from '../../components/LpLogo'

// hooks
import { useAccount } from '../../hooks/useAccount'

function Rewards(props) {
  const [,accountDetails,pendingRewards] = useAccount(props);

  const styles = useSpring(fadeIn)
  if(props.addresses && accountDetails && pendingRewards) {
    return (
      <animated.div style={styles} className="flex flex-col items-center w-full">
        <div className="card w-5/6 md:w-4/5 lg:w-4/6 text-center">
          <p className="text-2xl font-black">
            UNCLAIMED REWARDS
          </p>
          <Table className="text-center align-middle">
            <thead>
              <tr>
                <th>Pool</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr key="pool1">
                <td>
                  <span className="flex flex-row justify-center items-center">
                    <TokenLogo />HDAO
                  </span>
                </td>
                <td>
                  <span className="flex flex-row items-center justify-center">
                    <TokenLogo />
                    <p>{accountDetails.singleStaking.pendingRewards}</p>
                  </span>
                </td>
                <td className="text-right">
                  <ClaimButton {...props} stakedAddress={props.addresses.singleStaking} disabled={accountDetails.singleStaking.pendingRewards <= .01} />
                </td>
              </tr>
              <tr key="pool2">
                <td>
                  <span className="flex flex-row justify-center items-center">
                    <LpLogo />HDAO LP
                  </span>
                </td>
                <td>
                  <span className="flex flex-row items-center justify-center">
                    <TokenLogo />
                    <p>{accountDetails.lpStaking.pendingRewards}</p>
                  </span>
                </td>
                <td className="text-right">
                  <ClaimButton {...props} stakedAddress={props.addresses.lpStaking} disabled={accountDetails.lpStaking.pendingRewards <= .01} />
                </td>
              </tr>
            </tbody>
          </Table>
          <p className="text-xs">
            REMINDER: Claimed rewards have a vesting period of 18 months before they are available for withdrawal
          </p>
        </div>
        <RewardsTable
          {...props}
          stakedAddress={props.addresses.escrowPool}
          pendingRewards={pendingRewards}
        />
      </animated.div>
    )
  } else {
    return (
      <></>
    )
  }
}
 
export default Rewards;