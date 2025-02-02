import React, { useState, useEffect } from "react";
// import { getStoryblokApi } from "@storyblok/react"
import Table from "react-bootstrap/Table";
import { fadeIn } from "../../utils/springs";
import { formatMoney, formatPct } from "../../utils/strings";
import { useSpring, animated } from "react-spring";
import Modal from "react-bootstrap/Modal";

// components
import StakingInterface from "../../components/StakingInterface";
import DetailsModal from "../../components/DetailsModal";
import TokenLogo from "../../components/TokenLogo";
import LpLogo from "../../components/LpLogo";

// hooks
import { useAccount } from "../../hooks/useAccount";
import { useBalances } from "../../hooks/useBalances";
import { useApprovals } from "../../hooks/useApprovals";
import { usePrices } from "../../hooks/usePrices";
import { useTvl } from "../../hooks/useTvl";
import { useApr } from "../../hooks/useApr";

function Landing(props) {
  const [hdaoBalance, slpBalance, lpBalance] = useBalances(props);
  const hdaoPrice = usePrices();
  const [singleTvl, lpTvl, lpPrice] = useTvl(props, hdaoPrice);
  const [singleApr, lpApr] = useApr(props, hdaoPrice, singleTvl, lpTvl);
  const [slpApproval, lpApproval] = useApprovals(props);
  const [pendingRewards, accountDetails] = useAccount(props);

  // show states
  const [showSingle, setShowSingle] = useState(false);
  const [showLp, setShowLp] = useState(false);
  const [showSingleDetails, setShowSingleDetails] = useState(false);
  const [showLpDetails, setShowLpDetails] = useState(false);

  const handleCloseSingle = () => setShowSingle(false);
  const handleShowSingle = () => setShowSingle(true);

  const handleCloseLp = () => setShowLp(false);
  const handleShowLp = () => setShowLp(true);

  const handleCloseSingleDetails = () => setShowSingleDetails(false);
  const handleShowSingleDetails = () => setShowSingleDetails(true);

  const handleCloseLpDetails = () => setShowLpDetails(false);
  const handleShowLpDetails = () => setShowLpDetails(true);

  const styles = useSpring(fadeIn);

  if (props.addresses) {
    const loaded = pendingRewards >= 0;
    if (loaded) {
      return (
        <>
          <animated.div
            style={styles}
            className="flex flex-col items-center w-full"
          >
            <div className="card w-5/6 md:w-4/5 lg:w-4/6 flex-grow text-center">
              <p className="text-2xl font-black">POOLS</p>
              <Table responsive className="text-center align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Total Value Locked</th>
                    <th>APR</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr key="pool1">
                    <td>
                      <span className="flex flex-row justify-center items-center">
                        <TokenLogo />
                        HDAO
                      </span>
                    </td>
                    <td>
                      {" "}
                      {(singleTvl >= 0 && formatMoney(singleTvl)) || "..."}{" "}
                    </td>
                    <td>
                      {" "}
                      {(singleApr >= 0 && formatPct(singleApr)) || "..."}{" "}
                    </td>
                    <td>
                      <span className="flex flex-row justify-end">
                        <p
                          className="btn-lt btn-lt-primary my-2 mx-px"
                          onClick={handleShowSingleDetails}
                        >
                          Details
                        </p>
                        <button
                          className="btn-lt btn-lt-secondary my-2 mx-px"
                          disabled
                        >
                          Stake
                        </button>
                      </span>
                    </td>
                  </tr>
                  <tr key="pool2">
                    <td>
                      <span className="flex flex-row justify-center items-center">
                        <LpLogo />
                        HDAO LP
                      </span>
                    </td>
                    <td> {(lpTvl >= 0 && formatMoney(lpTvl)) || "..."} </td>
                    <td> {(lpApr >= 0 && formatPct(lpApr)) || "..."} </td>
                    <td>
                      <span className="flex flex-row justify-end">
                        <a
                          className="btn-lt btn-lt-primary mx-px"
                          target="_blank"
                          rel="noreferrer"
                          href={
                            props.chainId === 137
                              ? "https://polygon.balancer.fi/#/pool/0xb53f4e2f1e7a1b8b9d09d2f2739ac6753f5ba5cb000200000000000000000137/invest"
                              : props.chainId === 1
                              ? "https://app.uniswap.org/#/add/v2/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/0xdac657ffd44a3b9d8aba8749830bf14beb66ff2d?chain=mainnet"
                              : "https://app.uniswap.org/"
                          }
                        >
                          <p className="text-base">Buy&nbsp;LP</p>
                        </a>
                        <p
                          className="btn-lt btn-lt-primary mx-px"
                          onClick={handleShowLpDetails}
                        >
                          Details
                        </p>
                        <button
                          role="button"
                          className="btn-lt btn-lt-secondary mx-px cursor-not-allowed"
                          disabled
                        >
                          Stake
                        </button>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </animated.div>
          <div>
            <Modal centered show={showSingle} onHide={handleCloseSingle}>
              <Modal.Body>
                <StakingInterface
                  {...props}
                  title="HDAO Single Staking"
                  apr={singleApr}
                  tokenAddress={props.addresses.hdao}
                  stakedAddress={props.addresses.singleStaking}
                  tokenBalance={hdaoBalance}
                  tokenApproval={slpApproval}
                />
              </Modal.Body>
            </Modal>
            <Modal centered show={showLp} onHide={handleCloseLp}>
              <Modal.Body>
                <StakingInterface
                  {...props}
                  title="HDAO LP Staking"
                  apr={lpApr}
                  tokenAddress={props.addresses.lpContract}
                  stakedAddress={props.addresses.lpStaking}
                  tokenBalance={lpBalance}
                  tokenApproval={lpApproval}
                />
              </Modal.Body>
            </Modal>
            <DetailsModal
              title="HDAO Single Staking"
              DepositLogo={TokenLogo}
              apr={singleApr}
              show={showSingleDetails}
              onHide={handleCloseSingleDetails}
              tvl={singleTvl}
              totalDeposits={accountDetails.singleStaking.totalDeposits}
              depositPrice={hdaoPrice}
              pendingRewards={accountDetails.singleStaking.pendingRewards}
              hdaoPrice={hdaoPrice}
            />
            <DetailsModal
              title="HDAO LP Staking"
              DepositLogo={LpLogo}
              apr={lpApr}
              show={showLpDetails}
              onHide={handleCloseLpDetails}
              tvl={lpTvl}
              totalDeposits={accountDetails.lpStaking.totalDeposits}
              depositPrice={lpPrice}
              pendingRewards={accountDetails.lpStaking.pendingRewards}
              hdaoPrice={hdaoPrice}
            />
          </div>
        </>
      );
    } else {
      return <p className="w-full text-center">Loading...</p>;
    }
  } else {
    return <></>;
  }
}

export default Landing;
