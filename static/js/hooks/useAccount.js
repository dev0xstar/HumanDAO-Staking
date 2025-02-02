import { useState, useEffect } from "react";
import { ethers } from "ethers";

const dateOptions = {
    timeStyle: "short",
    dateStyle: "short"
}

function timeDiff(datetime) {
    datetime = new Date(datetime).getTime();
    var now = new Date().getTime();

    if (isNaN(datetime)) {
        return "";
    }

    var milisec_diff = datetime - now;
    if(milisec_diff <= 0) {return "Unlocked"}

    var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));

    var date_diff = new Date(milisec_diff);

    var finalStr = "";
    if(days > 0) {
        finalStr += days + " Days " + date_diff.getHours() + " Hours"
    } else {
        finalStr += date_diff.getHours() + " Hours " + date_diff.getMinutes() + " Minutes"
    }
    return finalStr
}

function cleanDeposit(deposit) {
    // clean locked until time
    const lockedUntilRaw = deposit[2].toNumber() * 1000
    const lockedUntilClean = timeDiff(lockedUntilRaw)

    const newDeposit = {
        "rawAmount": parseFloat(ethers.utils.formatEther(deposit[0])),
        "amount": parseFloat(ethers.utils.formatEther(deposit[0])).toFixed(2),
        "depositTimeFmt": new Date(deposit[1].toNumber() * 1000).toLocaleString("en-US", dateOptions),
        "lockedUntilRaw": lockedUntilRaw,
        "lockedUntilClean": lockedUntilClean,
        "lockedUntilFmt": new Date(deposit[2].toNumber() * 1000).toLocaleString("en-US"),
        "multiplier": parseFloat(ethers.utils.formatEther(deposit[3])).toFixed(2) + "x"
    }
    return newDeposit
}

function cleanReward(reward) {
    // clean locked until time
    const lockedUntilRaw = reward[2].toNumber() * 1000
    const lockedUntilClean = timeDiff(lockedUntilRaw)

    const newReward = {
        "amount": parseFloat(ethers.utils.formatEther(reward[0])).toFixed(2),
        "depositTimeFmt": new Date(reward[1].toNumber() * 1000).toLocaleString("en-US", dateOptions),
        "lockedUntilRaw": lockedUntilRaw,
        "lockedUntilClean": lockedUntilClean,
        "lockedUntilFmt": new Date(lockedUntilRaw).toLocaleString("en-US")
    }
    return newReward
}

function useAccount(props) {
    const [poolDeposits, setPoolDeposits] = useState();
    const [totalpendingRewards, setTotalPendingRewards] = useState();
    const [pendingRewards, setPendingRewards] = useState();

    useEffect(() => {
        async function getDeposits() {
            let viewContract = new ethers.Contract(props.addresses.view, props.abis.view, props.library)
            var rawDeposits = await viewContract.fetchData(props.account)

            // handle pending rewards
            const newTotalPendingRewards = ethers.utils.formatEther(rawDeposits[0])

            // clean each pool deposit
            const pools = rawDeposits[1];
            const cleanPools = pools.reduce((acc, pool) => {
                const poolName = props.contracts[pool[0].toLowerCase()]
                const pendingRewards = parseFloat(ethers.utils.formatEther(pool[3])).toFixed(2)
                const deposits = pool[8].map((deposit) => {
                    return cleanDeposit(deposit)
                })
                const totalDeposits = deposits.reduce((acc, val) => {
                    acc += val.rawAmount
                    return acc
                }, 0)
                return {
                    ...acc,
                    [poolName]: {
                        "pendingRewards": pendingRewards,
                        "totalDeposits": totalDeposits.toFixed(2),
                        "deposits": deposits
                    }
                }
            }, {})

            setPoolDeposits(cleanPools)
            setTotalPendingRewards(newTotalPendingRewards)
        }

        async function getRewards() {
            let contract = new ethers.Contract(props.addresses.escrowPool, props.abis.stakingPool, props.library)
            var rawRewards = await contract.getDepositsOf(props.account)

            // clean each reward
            const newPendingRewards = rawRewards.map((reward) => {
                return cleanReward(reward)
            })

            setPendingRewards(newPendingRewards)
        }

        if (props.addresses) {
            getDeposits()
            getRewards()
        }
    }, [props])
    return [totalpendingRewards, poolDeposits, pendingRewards]
}

export {
    useAccount
}
