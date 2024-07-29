import ContractCard from "../components/temp-card";
import { ERC20_CONTRACT_ADDRESS, ERC721_CONTRACT_ADDRESS, ERC1155_CONTRACT_ADDRESS,
   PROFILE_STATUS_CONTRACT_ADDRESS, TIP_JAR_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS, STAKING_ERC1155_CONTRACT_ADDRESS } from "../constants/addresses";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import { Web3Button, useOwnedNFTs, useTokenBalance, useContract, useContractRead, useAddress, useConnectionStatus, ConnectWallet } from "@thirdweb-dev/react";
import SendDataButton from '../components/SendDataButton';
import StakeNFTCard from '../components/stake-nft1155-card';
import StakedNFTCard from '../components/staked-nft1155-card';
import Link from 'next/link'; // Import Link from Next.js





const Home: NextPage = () => {
  const router = useRouter();
  const { sec_key } = router.query;

  const address = useAddress();
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();

const {
  contract
} = useContract(ERC20_CONTRACT_ADDRESS, "token");

const {
  data: tokenBalance,
  isLoading: tokenBalanceIsLoading,
} = useTokenBalance(contract, address);

const {
  contract: ERC1155Contract
} = useContract(ERC1155_CONTRACT_ADDRESS, "edition-drop");

const {
  data: ownedERC1155NFTs,
  isLoading: ownedERC1155NFTsIsLoading,
} = useOwnedNFTs(ERC1155Contract, address);

  // Ensure `message` is a string
  const data_key = Array.isArray(sec_key) ? sec_key[0] : sec_key || 'Default message';


  useEffect(() => {
    if (sec_key) {
      console.log('Search term:', sec_key);
      // You can fetch data or perform actions based on the query parameter here
    }
  }, [sec_key]);

  const connectionStatus = useConnectionStatus();
  //const  message = 'Big99 Hello from Next.js';

  const {
    contract: stakingContract
  } = useContract(STAKING_ERC1155_CONTRACT_ADDRESS);

  const {
    data: stakedERC1155Tokens,
    isLoading: isStakedERC1155TokensLoading,
} = useContractRead(
    stakingContract,
    "getStakeInfo",
    [address]
);

useEffect(() => {
  if(!stakingContract || !address) return;

  async function getClaimableRewards() {
      const claimableRewards = await stakingContract?.call(
          "getStakeInfo",
          [address]
      );

      setClaimableRewards(claimableRewards[2]);
  };

  getClaimableRewards();
}, [address, stakingContract]);


  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {" "}
            
          </h1>

          <p className={styles.description}>Ref ID1: </p>
          <p className={styles.description}>Sec Key: {sec_key}</p>
          <p className={styles.description}>Connection Status: {connectionStatus}</p>
          <p className={styles.description}>Wallet Address: {address}</p>
          <p className={styles.description}>Token Balance: {tokenBalance?.displayValue} {tokenBalance?.symbol}</p>
          <p className={styles.description}>{claimableRewards && (
                            <p>Reward balance: {ethers.utils.formatEther(claimableRewards!)}</p>
                        
           )}</p>

<Web3Button
                            contractAddress={STAKING_ERC1155_CONTRACT_ADDRESS}
                            action={(contract) => contract.call("claimRewards",[0])}
                            //the reward balance seems to be for all tokens but the claim in [0] is just for that but all get reset
                            onSuccess={() => {
                              alert("Rewards claimed!");
                             setClaimableRewards(ethers.constants.Zero);
                        }}
                        isDisabled={!claimableRewards || claimableRewards.isZero()}
                        >Claim Rewards</Web3Button>

<p>Claim an ERC1155 NFT for 10 tokens</p>
<Web3Button
                            contractAddress={ERC1155_CONTRACT_ADDRESS}
                            action={(contract) => contract.erc1155.claim(0, 1)}
                            // 1st number is token ID, second number in brackets is the quantity
                        >Claim Token ID#0</Web3Button>-
                         <Web3Button
                            contractAddress={ERC1155_CONTRACT_ADDRESS}
                            action={(contract) => contract.erc1155.claim(1, 1)}
                            // 1st number is token ID, second number in brackets is the quantity
                        >Claim Token ID#1</Web3Button>-
                         <Web3Button
                            contractAddress={ERC1155_CONTRACT_ADDRESS}
                            action={(contract) => contract.erc1155.claim(2, 1)}
                            // 1st number is token ID, second number in brackets is the quantity
                        >Claim Token ID#2</Web3Button>-
                        <Web3Button
                            contractAddress={ERC1155_CONTRACT_ADDRESS}
                            action={(contract) => contract.erc1155.claim(3, 1)}
                            // 1st number is token ID, second number in brackets is the quantity
                        >Claim Token for Game001</Web3Button>-
                         <Web3Button
                            contractAddress={ERC1155_CONTRACT_ADDRESS}
                            action={(contract) => contract.erc1155.claim(4, 1)}
                            // 1st number is token ID, second number in brackets is the quantity
                        >Claim Token for Game002</Web3Button>-
                        <Web3Button
                            contractAddress={ERC1155_CONTRACT_ADDRESS}
                            action={(contract) => contract.erc1155.claim(5, 1)}
                            // 1st number is token ID, second number in brackets is the quantity
                        >Claim Token for Game003</Web3Button>-
                        <Web3Button
                            contractAddress={ERC1155_CONTRACT_ADDRESS}
                            action={(contract) => contract.erc1155.claim(6, 1)}
                            // 1st number is token ID, second number in brackets is the quantity
                        >Claim Token for Game004</Web3Button>

<div className={styles.componentCard}>
  <h3>Unstaked</h3>
  {ownedERC1155NFTsIsLoading ? (
    <p>Loading...</p>
  ) : (
    <div className={styles.cardContainer}>
      {ownedERC1155NFTs && ownedERC1155NFTs.length > 0 ? (
        ownedERC1155NFTs.map((nft) => (
          <StakeNFTCard key={nft.metadata.id} nft={nft} sec_key={data_key} />
        ))
      ) : (
        <p>No NFTs owned</p>
      )}
    </div>
  )}
</div>

<div className={styles.componentCard}>
            <h3>Staked</h3>
            {isStakedERC1155TokensLoading ? (
              <p>Loading...</p>
            ) : (
              <div className={styles.cardContainer}>
                {stakedERC1155Tokens && stakedERC1155Tokens.length > 0 ? (
                  stakedERC1155Tokens[0].map((stakedNFT: BigNumber, index: number) => (
                    <StakedNFTCard key={stakedNFT.toNumber()} sec_key={data_key} tokenId={stakedNFT.toNumber()} />
                  ))
                ) : (
                  <p>No NFTs staked</p>
                )}
              </div>
            )}
          </div>

                    
<p>---</p>
<p>---</p>
<p>---</p>
<p>---</p>

          {connectionStatus === 'disconnected' && (
          <ConnectWallet 
            btnTitle='Sign In'
            modalTitle='Select sign in method'
            detailsBtn={() => {
                return <p>Profile</p>
            }}
            />
          )}

{connectionStatus === 'connected' && (
          <SendDataButton 
          sec_key={data_key} 
          connectionStatus={connectionStatus}
          address={address}
          tokenBalance={tokenBalance?.displayValue}
          rewardBalance={claimableRewards ? ethers.utils.formatEther(claimableRewards) : undefined}
            
          />
          )}

          {/* Add a link to navigate to the game page */}
          <Link href="/project/FlappyGame" legacyBehavior>
            <a className={styles.gameLink}>Play Flappy Game</a>
          </Link> |
          <Link href="/project/CommandoGame" legacyBehavior>
            <a className={styles.gameLink}> Play Commando Game</a>
          </Link>

        </div>

        <div className={styles.grid}>
          {connectionStatus === 'connected' && (
            <>
          <ContractCard
          href={`/project/erc20?sec_key=${data_key}`}
          contractAddress={ERC20_CONTRACT_ADDRESS}
          title="ERC20 >>"
          description="Claim ERC20 Tokens"
          />
          
          <ContractCard
          href={`/project/erc721?sec_key=${data_key}`}
          contractAddress={ERC721_CONTRACT_ADDRESS}
          title="ERC721 >>"
          description="Claim ERC721 Tokens"
          />
       
          <ContractCard
          href={`/project/erc1155?sec_key=${data_key}`}
          contractAddress={ERC1155_CONTRACT_ADDRESS}
          title="ERC1155 >>"
          description="Claim ERC1155 Tokens"
          />
          <ContractCard
          href={`/project/staking?sec_key=${data_key}`}
          contractAddress={STAKING_CONTRACT_ADDRESS}
          title="Staking >>"
          description="Stake your ERC721 NFT to earn ERC20 Tokens"
          />
          <ContractCard
          href={`/project/staking1155?sec_key=${data_key}`}
          contractAddress={STAKING_ERC1155_CONTRACT_ADDRESS}
          title="1155 Staking >>"
          description="Stake your ER1155 NFT to earn ERC20 Tokens"
          />
          <ContractCard
          href={`/project/original?sec_key=${data_key}`}
          contractAddress={ERC20_CONTRACT_ADDRESS}
          title="Original Index Page >>"
          description="Access all demo contracts"
          />
          </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
