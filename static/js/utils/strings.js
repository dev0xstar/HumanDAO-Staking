function formatMoney(moneyStr) {
    return "$" + moneyStr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatPct(pctVal) {
    return (pctVal * 100).toFixed(1) + "%"
}

export {
    formatMoney,
    formatPct
}
