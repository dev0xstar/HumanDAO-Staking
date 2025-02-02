import {useEffect, useState} from "react";
import {ethers} from "ethers";
import axios from "axios";

const endpoint = "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2";
const TVL_QUERY = `
{
	pool(id: "0xb53f4e2f1e7a1b8b9d09d2f2739ac6753f5ba5cb000200000000000000000137") {
        totalLiquidity,
        totalShares
  }
}
`;

async function calculateLpPrice(props, hdaoPrice) {
    const hdaoContract = new ethers.Contract(props.addresses.hdao, props.abis.erc20, props.library)
    const hdaoBalanceOfLp = await hdaoContract.balanceOf(props.addresses.lpContract)
    const lpContract = new ethers.Contract(props.addresses.lpContract, props.abis.uniswapLp, props.library)
    const totalSupplyLp = ethers.utils.formatEther(await lpContract.totalSupply());
    const normalizedHdaoBalance = ethers.utils.formatEther(hdaoBalanceOfLp)
    return (normalizedHdaoBalance * hdaoPrice * 2) / totalSupplyLp;
}


function useTvl(props, hdaoPrice) {
    const [singleTvl, setSingleTvl] = useState()
    const [lpTvl, setLpTvl] = useState()
    const [lpPrice, setLpPrice] = useState()

    useEffect(() => {
        async function getSingleTvl() {
            let hdaoContract = new ethers.Contract(props.addresses.hdao, props.abis.erc20, props.library)
            var balance = await hdaoContract.balanceOf(props.addresses.singleStaking)
            balance = ethers.utils.formatEther(balance)
            const newSingleTvl = balance * hdaoPrice
            setSingleTvl(newSingleTvl)
        }

        async function getLpTvl() {

            if (props.chainId === 137) {
                // polygon TVL

                // get value per share of the LP
                const tvlResult = await axios({
                    url: endpoint,
                    method: "POST",
                    data: {
                        query: TVL_QUERY
                    }
                })
                const valPerShare = parseFloat(tvlResult.data.data.pool.totalLiquidity) / parseFloat(tvlResult.data.data.pool.totalShares)

                // get shares in the staking contract
                let lpContract = new ethers.Contract(props.addresses.lpContract, props.abis.erc20, props.library)
                var lpStakingShareBalance = await lpContract.balanceOf(props.addresses.lpStaking)
                lpStakingShareBalance = ethers.utils.formatUnits(lpStakingShareBalance, 'ether')

                const newLpTvl = lpStakingShareBalance * valPerShare
                setLpPrice(valPerShare)
                setLpTvl(newLpTvl)
            } else {
                // Ethereum TVL
                let hdaoContract = new ethers.Contract(props.addresses.lpContract, props.abis.erc20, props.library)
                var balance = await hdaoContract.balanceOf(props.addresses.lpStaking)
                balance = ethers.utils.formatEther(balance)

                const newLpPrice = await calculateLpPrice(props, hdaoPrice);
                const newLpTvl = balance * newLpPrice
                setLpPrice(lpPrice)
                setLpTvl(newLpTvl)
            }
        }

        if (props.addresses && hdaoPrice) {
            getSingleTvl()
            getLpTvl()
        }
    }, [props, hdaoPrice])
    return [singleTvl, lpTvl, lpPrice]
}

export {
    useTvl
}
