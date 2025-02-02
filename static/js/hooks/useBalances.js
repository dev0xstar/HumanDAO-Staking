import { useState, useEffect } from "react";
import { ethers } from "ethers";

function useHdaoBalance(props) {
    const [hdaoBalance, setHdaoBalance] = useState();

    useEffect(() => {
        async function getBalance() {
            const signer = props.library.getSigner()
            let hdaoContract = new ethers.Contract(props.addresses.hdao, props.abis.erc20, signer)
            var newBalance = await hdaoContract.balanceOf(props.account)
            newBalance = ethers.utils.formatEther(newBalance)
            setHdaoBalance(newBalance)
        }

        if(props.addresses) {
            getBalance()
        }
    }, [props])
    return hdaoBalance
}

function useSingleLpBalance(props) {
    const [slpBalance, setSlpBalance] = useState();

    useEffect(() => {
        async function getBalance() {
            const signer = props.library.getSigner()
            let slpContract = new ethers.Contract(props.addresses.singleStaking, props.abis.erc20, signer)
            var newBalance = await slpContract.balanceOf(props.account)
            newBalance = ethers.utils.formatEther(newBalance)
            setSlpBalance(newBalance)
        }

        if (props.addresses) {
            getBalance()
        }
    }, [props])
    return slpBalance
}

function useLpBalance(props) {
    const [lpBalance, setLpBalance] = useState();

    useEffect(() => {
        async function getBalance() {
            let slpContract = new ethers.Contract(props.addresses.lpContract, props.abis.erc20, props.library)
            var newBalance = await slpContract.balanceOf(props.account)
            newBalance = ethers.utils.formatEther(newBalance)
            setLpBalance(newBalance)
        }

        if (props.addresses) {
            getBalance()
        }
    }, [props])
    return lpBalance
}

function useBalances(props) {
    const hdaoBalance = useHdaoBalance(props)
    const slpBalance = useSingleLpBalance(props)
    const lpBalance = useLpBalance(props)
    return [hdaoBalance, slpBalance, lpBalance]
}

export {
    useHdaoBalance,
    useSingleLpBalance,
    useLpBalance,
    useBalances
}
