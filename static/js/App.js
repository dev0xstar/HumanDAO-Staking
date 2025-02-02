import React, { useEffect, useState, useReducer, useCallback } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { ethers } from 'ethers';

import _ from "lodash";

// web3modal helpers
import { Web3ModalSetup } from "./helpers";

// Storyblok
import { storyblokInit, apiPlugin, getStoryblokApi } from "@storyblok/react";

// assets
import { ReactComponent as BgTopLeft } from './assets/bg_top_left.svg';
import { ReactComponent as BgLeft } from './assets/bg_left.svg';
import { ReactComponent as BgRight } from './assets/bg_right.svg';

// styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// components
import Navbar from './components/Navbar'
import NotLoaded from './components/NotLoaded'

// pages
import Landing from './pages/Landing'
import Staking from './pages/Staking'
import Rewards from './pages/Rewards'

// data
import allAddresses from "./data/addresses.json";
import abis from "./data/abis.js";

const web3Modal = Web3ModalSetup();

function getAddresses(chainId) {
  return chainId && allAddresses[chainId.toString()] ? allAddresses[chainId.toString()] : undefined
}

function getContracts(chainId) {
  return chainId && allAddresses[chainId.toString()] ? _.invert(allAddresses[chainId.toString().toLowerCase()]) : undefined
}

function chainReducer(state, action) {
  var newState;
  if(action.type === "account") {
    newState = {
      ...state,
      account: action.account,
      provider: action.provider
    }
  } else if(action.type === "chain") {
    newState = {
      ...state,
      chainId: action.chainId,
      provider: action.provider
    }
  } else {
    newState = {
      account: action.account,
      chainId: action.chainId,
      provider: action.provider
    }
  }
  return newState
}

storyblokInit({
  accessToken: "GWQZ8nicV4wbyoiQC8vUSgtt",
  use: [apiPlugin],
  // components,
});

function App(props) {
  const [chainInfo, setChainInfo] = useReducer(
    chainReducer,
    {
      account: undefined,
      chainId: undefined,
      provider: undefined
    }
  )
  const [block, setBlock] = useState()
  const [stakingAPR, setStakingAPR] = useState({ initial: 0 })

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (chainInfo.provider && chainInfo.provider.provider && typeof chainInfo.provider.provider.disconnect == "function") {
      await chainInfo.provider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  const loadWeb3Modal = useCallback(async () => {
    async function getAddress(provider) {
      if (provider) {
        const signer = await provider.getSigner()
        const newAccount = await signer.getAddress()
        return newAccount
      }
    }

    async function getChainId(provider) {
      if (provider) {
        const network = await provider.getNetwork()
        return network.chainId
      }
    }

    async function onBlock() {
      setBlock(newProvider.blockNumber)
    }

    var provider;
    try {
      provider = await web3Modal.connect();
      await web3Modal.toggleModal();
    } catch (err) {
      console.error(err)
      return
    }
    const newProvider = new ethers.providers.Web3Provider(provider)
    newProvider.on('block', onBlock)
    setChainInfo({
      type: "all",
      account: await getAddress(newProvider),
      chainId: await getChainId(newProvider),
      provider: newProvider
    })


    provider.on("chainChanged", async (chainId) => {
      const chainInfoProvider = new ethers.providers.Web3Provider(provider)
      setChainInfo({
        type: "chain",
        chainId: await getChainId(chainInfoProvider),
        provider: chainInfoProvider
      })
    });

    provider.on("accountsChanged", async (newAccounts) => {
      const chainInfoProvider = new ethers.providers.Web3Provider(provider)
      setChainInfo({
        type: "account",
        account: await getAddress(chainInfoProvider),
        provider: chainInfoProvider
      })
    });
  }, [setChainInfo]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }

    // Fetching storyblok story (with the stored APR data) once when application is loaded
    async function fetchData() {
      const storyblokApi = getStoryblokApi()
      const { data } = await storyblokApi.get("cdn/stories/dashboard", { version: "public" });
      setStakingAPR(data.story.content.body[1].blocks[0]) // If data structure in Storyblok changes this must be updated to reflect that
    }
    fetchData()
  }, [loadWeb3Modal]);

  // constants
  const addresses = getAddresses(chainInfo.chainId)
  const contracts = getContracts(chainInfo.chainId)

  return (
    <div id="app">
      <div id="bg">
        <BgTopLeft className="fixed left-0 top-0" />
        <BgLeft className="fixed left-0 top-1/2" />
        <BgRight className="fixed bottom-0 right-0" />
      </div>
      <div className="relative" id="content">
        <Router>
          <Navbar
            account={chainInfo.account}
            chainId={chainInfo.chainId}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            addresses={addresses}
            />
          <Switch>
            <Route exact path="/">
              <Landing
                account={chainInfo.account}
                chainId={chainInfo.chainId}
                library={chainInfo.provider}
                block={block}
                abis={abis}
                addresses={addresses}
                contracts={contracts}
              />
            </Route>
            <Route path="/deposits">
              <Staking
                account={chainInfo.account}
                chainId={chainInfo.chainId}
                library={chainInfo.provider}
                block={block}
                abis={abis}
                addresses={addresses}
                contracts={contracts}
              />
            </Route>
            <Route path="/rewards">
              <Rewards
                account={chainInfo.account}
                chainId={chainInfo.chainId}
                library={chainInfo.provider}
                block={block}
                abis={abis}
                addresses={addresses}
                contracts={contracts}
              />
            </Route>
          </Switch>
        </Router>
        {!addresses ? <NotLoaded loadWeb3Modal={loadWeb3Modal} chainInfo={chainInfo} stakingAPR={stakingAPR} /> : <></>}
      </div>
    </div>
  )
}

export default App;
