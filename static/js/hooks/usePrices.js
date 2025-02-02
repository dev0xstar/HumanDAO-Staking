import { useState, useEffect } from "react";

function usePrices() {
    const [hdaoPrice, setHdaoPrice] = useState();

    useEffect(() => {
        async function getHdaoPrice() {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=humandao')

            if(response.status !== 200) return;
            const data = await response.json()
            setHdaoPrice(data[0].current_price)
        }
        getHdaoPrice()
    }, [hdaoPrice])
    return hdaoPrice
}

export {
    usePrices
}
