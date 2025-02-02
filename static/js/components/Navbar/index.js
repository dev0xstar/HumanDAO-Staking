import React, { useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Nav from 'react-bootstrap/Nav'
import { Link, NavLink } from "react-router-dom";

// hooks
import { usePrices } from '../../hooks/usePrices'

// components
import TokenLogoWhite from '../TokenLogoWhite';

// assets
import { ReactComponent as Logo } from '../../assets/mainLogo.svg';
import { proposalPlugins } from '@babel/preset-env/data/shipped-proposals';

function shortenAccount(account) {
  return account ? account.slice(0, 4) + "..." + account.slice(account.length-4, account.length) : ""
}

function mapChainId(chainId) {
  switch(chainId) {
    case 1:
      return "Ethereum"
    case 137:
      return "Polygon"
    case 80001:
      return "Mumbai"
  }
}


function Navbar({
  account,
  chainId,
  addresses,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal
}) {
  const hdaoPrice = usePrices();

  return (
    <nav variant="tabs" className="px-4 pt-4 grid grid-cols-3 items-center justify-items-center">
      <div></div>

      <div className="flex flex-col items-center">
        <a target="_blank" rel="noreferrer" href="https://humandao.org/">
          <Logo className="h-32" />
        </a>
        <div className="text-center whitespace-pre overflow-visible pt-2 pb-4 text-2xl md:text-3xl lg:text-4xl" id="title">
          $HDAO Staking
        </div>
      </div>

      <div className="flex justify-around items-center self-start">
        {web3Modal &&
          (web3Modal?.cachedProvider ? (
            <div className='flex flex-row'>
              {mapChainId(chainId) &&
                <div className="connect-info mr-1">
                  <p> {mapChainId(chainId)} </p>
                </div>
              }
              <OverlayTrigger
                trigger="click"
                rootClose
                placement="bottom"
                overlay={
                  <button className="disconnect-btn mt-2" onClick={logoutOfWeb3Modal}>Disconnect</button>
                }
              >
              <div className="connect-btn mr-1 flex flex-row items-center" id="account-display">
                <p className="mr-2">{shortenAccount(account)}</p>
              </div>

              </OverlayTrigger>

            </div>
          ) : (
            <button type="button" className="connect-btn" onClick={loadWeb3Modal}>Connect Wallet</button>
          ))}
      </div>
      <Nav className="col-span-3 grid grid-cols-3 text-center" variant="pills" defaultActiveKey="/">
        <Nav.Item>
          <Nav.Link className="btn-nav" as={NavLink} activeClassName="active" exact to="/" >Pools</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="btn-nav" as={NavLink} activeClassName="active" to="/deposits" >Deposits</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="btn-nav" as={NavLink} activeClassName="active" to="/rewards" >Rewards</Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="col-span-3 w-5/6 md:w-4/5 lg:w-4/6 max-w-3xl my-2">
        <p className={"flex flex-row items-center w-full text-right text-base" + (addresses ? " justify-end" : " justify-center")}>
          <a
            className="hover:text-black"
            target="_blank"
            rel="noreferrer"
            href={
              chainId === 137 ? "https://polygon.balancer.fi/#/trade"
              :
              "https://app.uniswap.org/#/swap?inputCurrency=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&outputCurrency=0xdac657ffd44a3b9d8aba8749830bf14beb66ff2d&chain=mainnet"
            }
          >
            <TokenLogoWhite />
            <span className="mr-2">HDAO Price</span> <span className="font-black"> ${hdaoPrice ? hdaoPrice.toFixed(3) : ""} </span>
          </a>
        </p>
      </div>
    </nav>
  )    
}

export default Navbar;