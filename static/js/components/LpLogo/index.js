import React from 'react';

import { ReactComponent as HdaoLogo } from '../../assets/hdaoLogo.svg';
import { ReactComponent as EthLogo } from '../../assets/ethLogo.svg';

function LpLogo() {
  return (
    <div className='flex flex-row items-end mr-1'>
      <HdaoLogo className="h-6 w-6 inline" />
      <EthLogo className="h-3 w-3 -ml-1.5 inline" />
    </div>
  )
}

export default LpLogo;
