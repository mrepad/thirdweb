import ContractCard from "../../components/temp-card";
import { ERC20_CONTRACT_ADDRESS, ERC721_CONTRACT_ADDRESS, ERC1155_CONTRACT_ADDRESS,
   PROFILE_STATUS_CONTRACT_ADDRESS, TIP_JAR_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS, STAKING_ERC1155_CONTRACT_ADDRESS } from "../../constants/addresses";
import styles from "../../styles/Home.module.css";
import { NextPage } from "next";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import { Web3Button, useOwnedNFTs, useTokenBalance, useContract, useContractRead, useAddress, useConnectionStatus, ConnectWallet } from "@thirdweb-dev/react";
import SendDataButton from '../../components/SendDataButton';
import StakeNFTCard from '../../components/stake-nft1155-card';
import StakedNFTCard from '../../components/staked-nft1155-card';
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
          
          

        <p>---</p>
<p>---</p>
                 

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

        </div>
        
      </div>
    </main>
  );
};

export default Home;