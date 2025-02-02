import React from 'react'
import TokenLogo from '../../components/TokenLogo'
import LpLogo from '../../components/LpLogo'

function NotLoaded({ loadWeb3Modal, chainInfo, stakingAPR }) {
    function handleSwitchPolygon() {
        if(chainInfo?.provider) {
            chainInfo.provider.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: "0x89" }]
            })
            loadWeb3Modal()
        }
    }

    function handleSwitchEth() {
        if (chainInfo?.provider) {
            chainInfo.provider.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: "0x1" }]
            })
            loadWeb3Modal()
        }
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center card-shadow py-6 w-4/5 lg:w-3/5 lg:w-2/5 bg-btn-secondary border-2 border-black mt-2 px-4 max-w-3xl rounded-lg shadow-md text-center">
                <img className="h-16 mb-4" src='./images/coin.png' alt="coin" />
                <p className="text-center">Connect your wallet to a supported network to access staking</p>
                <p className="text-center mt-2">HDAO staking is available on Ethereum and Polygon</p>
                {chainInfo?.provider &&
                    <div className='flex flex-row items-center'>
                        <p className="switch-btn text-xs mx-1 mt-4" onClick={handleSwitchPolygon} >Switch to Polygon</p>
                        <p className="switch-btn text-xs mx-1 mt-4" onClick={handleSwitchEth} >Switch to Ethereum</p>
                    </div>
                }
            </div>
            <div className="flex flex-col items-center card-shadow py-6 w-4/5 lg:w-3/5 lg:w-2/5 bg-btn-secondary border-2 border-black mt-6 px-4 max-w-3xl rounded-lg shadow-md text-center">
            <div className="text-center whitespace-pre overflow-visible pb-2 text-xl md:text-2xl lg:text-3xl font-bold">NB: This round of staking has ended!</div>
                <div className="text-center whitespace-pre overflow-visible pt-2 text-xl md:text-2xl lg:text-3xl">Ethereum</div>
                <p className={"flex flex-row items-center w-full text-right text-base justify-center opacity-30"}>
                    <TokenLogo />
                    <span className="mr-2">APR Single Sided</span> <span className="font-black"> {stakingAPR.single_ethereum} </span>
                </p>
                <p className={"flex flex-row items-center w-full text-right text-base justify-center opacity-30"}>
                    <LpLogo />
                    <span className="mr-2">APR HDAO-USDC LP</span> <span className="font-black"> {stakingAPR.lp_ethereum} </span>
                </p>
                <div className="text-center whitespace-pre overflow-visible pt-2 text-xl md:text-2xl lg:text-3xl">Polygon</div>
                <p className={"flex flex-row items-center w-full text-right text-base justify-center opacity-30"}>
                    <TokenLogo />
                    <span className="mr-2">APR Single Sided</span> <span className="font-black"> {stakingAPR.single_polygon} </span>
                </p>
                <p className={"flex flex-row items-center w-full text-right text-base justify-center opacity-30"}>
                    <LpLogo />
                    <span className="mr-2">APR HDAO-ETH LP</span> <span className="font-black"> {stakingAPR.lp_polygon} </span>
                </p>
            </div>

        </div>
    )
}

export default NotLoaded;
