import { useState, useEffect } from "react";
import { ethers } from "ethers";

function useSingleLpApproval(props) {
    const [slpApproval, setSlpApproval] = useState();

    useEffect(() => {
        async function getApproval() {
            let hdaoContract = new ethers.Contract(props.addresses.hdao, props.abis.erc20, props.library)
            var newApproval = await hdaoContract.allowance(props.account, props.addresses.singleStaking)
            newApproval = parseFloat(ethers.utils.formatEther(newApproval))
            setSlpApproval(newApproval)
        }

        if (props.addresses) {
            getApproval()
        }
    }, [props])
    return slpApproval
}

function useLpApproval(props) {
    const [lpApproval, setLpApproval] = useState();

    useEffect(() => {
        async function getApproval() {
            let lpContract = new ethers.Contract(props.addresses.lpContract, props.abis.erc20, props.library)
            var newApproval = await lpContract.allowance(props.account, props.addresses.lpStaking)
            newApproval = parseFloat(ethers.utils.formatEther(newApproval))
            setLpApproval(newApproval)
        }

        if (props.addresses) {
            getApproval()
        }
    }, [props])
    return lpApproval
}

function useApprovals(props) {
    const slpApproval = useSingleLpApproval(props)
    const lpApproval = useLpApproval(props)
    return [slpApproval, lpApproval]
}

export {
    useSingleLpApproval,
    useLpApproval,
    useApprovals
}
