import { useState, useEffect } from "react";
import { ethers } from "ethers";

const SECONDS_PER_YEAR = 60*60*24*356

function useApr(props, hdaoPrice, singleTvl, lpTvl) {
    const [singleApr, setSingleApr] = useState()
    const [lpApr, setLpApr] = useState()
    
    useEffect(() => {
        async function getAprVals() {
            let managerContract = new ethers.Contract(props.addresses.stakingManager, props.abis.stakingManager, props.library)
            
            // get time since last distribution
            var lastDistribution = await managerContract.lastDistribution()
            lastDistribution = lastDistribution.toNumber()
            const secondsSinceDistribution = (Date.now() / 1000) - lastDistribution

            // get rewards per second
            var rewardPerSecond = await managerContract.rewardPerSecond()
            rewardPerSecond = parseFloat(ethers.utils.formatEther(rewardPerSecond))

            return {
                "rewardPerSecond": rewardPerSecond,
                "secondsSinceDistribution": secondsSinceDistribution
            }
        }

        async function getSingleApr(aprVals, weight) {
            const newSingleApr = ((aprVals.rewardPerSecond * weight * hdaoPrice * aprVals.secondsSinceDistribution) / singleTvl) * (SECONDS_PER_YEAR / aprVals.secondsSinceDistribution)
            setSingleApr(newSingleApr)
        }

        async function getLpApr(aprVals, weight) {
            const newLpApr = ((aprVals.rewardPerSecond * weight * hdaoPrice * aprVals.secondsSinceDistribution) / lpTvl) * (SECONDS_PER_YEAR / aprVals.secondsSinceDistribution)
            setLpApr(newLpApr)
        }

        if (props.addresses && (singleTvl >= 0) && (lpTvl >= 0) && hdaoPrice) {
            getAprVals().then((aprVals) => {
                getSingleApr(aprVals, .3)
                getLpApr(aprVals, .7)
            })
        }
    }, [props, singleTvl, lpTvl, hdaoPrice])
    return [singleApr, lpApr]
}

export {
    useApr
}
