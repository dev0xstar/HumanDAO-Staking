import React, { useState } from 'react';
import { fadeIn } from '../../utils/springs';
import { useSpring, animated } from "react-spring";

// components
import DepositsTable from '../../components/DepositsTable'

// hooks
import { useAccount } from '../../hooks/useAccount'

function Staking(props) {
  const [,accountDetails] = useAccount(props);

  const styles = useSpring(fadeIn)
  if (props.addresses && accountDetails) {
    return (
      <animated.div style={styles} className="flex flex-col items-center w-full">
          <DepositsTable
            {...props}
            title="HDAO Single Staking"
            stakingType="single"
            stakedAddress={props.addresses.singleStaking}
            deposits={accountDetails.singleStaking.deposits}
          />
          <DepositsTable
            {...props}
            title="HDAO LP Staking"
            stakingType="lp"
            stakedAddress={props.addresses.lpStaking}
            deposits={accountDetails.lpStaking.deposits}
          />
      </animated.div>
    )
  } else {
    return (
      <></>
    )
  }
}
 
export default Staking;