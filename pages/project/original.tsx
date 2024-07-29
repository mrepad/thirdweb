import ContractCard from "../../components/contract-card";
import { ERC20_CONTRACT_ADDRESS, ERC721_CONTRACT_ADDRESS, ERC1155_CONTRACT_ADDRESS,
   PROFILE_STATUS_CONTRACT_ADDRESS, TIP_JAR_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS, STAKING_ERC1155_CONTRACT_ADDRESS } from "../../constants/addresses";
import styles from "../../styles/Home.module.css";
import { NextPage } from "next";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useOwnedNFTs, useTokenBalance, useContract, useAddress, useConnectionStatus, ConnectWallet } from "@thirdweb-dev/react";
import SendDataButton from '../../components/SendDataButton';




const Home: NextPage = () => {
  const router = useRouter();
  const { sec_key } = router.query;

  const address = useAddress();

const {
  contract: erc20Contract
} = useContract(ERC20_CONTRACT_ADDRESS, "token");

const {
  data: tokenBalance,
  isLoading: tokenBalanceIsLoading,
} = useTokenBalance(erc20Contract, address);



const {
  contract: erc1155Contract
} = useContract(ERC1155_CONTRACT_ADDRESS, "edition-drop");

const {
  data: ownedNFTs,
  isLoading: ownedNFTsIsLoading,
} = useOwnedNFTs(erc1155Contract, address);


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

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            My{" "}
            <span className={styles.gradientText0}>

                Demo Contracts
            </span>
          </h1>

          <p className={styles.description}> Select a contract to intereact with.</p>

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
          <SendDataButton dataPass={data_key} statusPass={connectionStatus}/>
          )}

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
          href={`/project/profileStatus?sec_key=${data_key}`}
          contractAddress={PROFILE_STATUS_CONTRACT_ADDRESS}
          title="Profile Status >>"
          description="Update your profile status on the blockchain"
          />
          <ContractCard
          href={`/project/tipJar?sec_key=${data_key}`}
          contractAddress={TIP_JAR_CONTRACT_ADDRESS}
          title="Tip Jar >>"
          description="Leave a tip on the blockchain"
          />
          <ContractCard
          href={`/project/staking1155?sec_key=${data_key}`}
          contractAddress={STAKING_ERC1155_CONTRACT_ADDRESS}
          title="1155 Staking >>"
          description="Stake your ER1155 NFT to earn ERC20 Tokens"
          />
          </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
