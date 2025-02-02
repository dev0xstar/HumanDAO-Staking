import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { INFURA_ID } from "../utils/constants";

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3ModalSetup = () =>
    new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
        providerOptions: {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: INFURA_ID,
                    rpc: {
                        1: `https://mainnet.infura.io/v3/${INFURA_ID}`,
                        137: "https://polygon-rpc.com",
                        80001: `https://polygon-mumbai.infura.io/v3/${INFURA_ID}`
                    },
                },
            },
        },
    });

export default web3ModalSetup;