import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import { useContractRead, useContract, useTokenBalance, useAddress, ConnectWallet } from '@thirdweb-dev/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import { ERC20_CONTRACT_ADDRESS, ERC1155_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS, STAKING_ERC1155_CONTRACT_ADDRESS } from "../constants/addresses";

export default function Navbar() {
    const router = useRouter();
    const { sec_key } = router.query;

    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();

    const address = useAddress();
    const displayAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : 'No Address Connected';

    // Ensure `message` is a string
  const data_key = Array.isArray(sec_key) ? sec_key[0] : sec_key || 'Default message';

  const {
    contract
  } = useContract(ERC20_CONTRACT_ADDRESS, "token");

  const {
    data: tokenBalance,
    isLoading: tokenBalanceIsLoading,
  } = useTokenBalance(contract, address);


  useEffect(() => {
    if (sec_key) {
      console.log('Search term:', sec_key);
      // You can fetch data or perform actions based on the query parameter here
    }
  }, [sec_key]);

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
        <div className={styles.navbar}>
            
            
            <Link href="/">
                <div className={styles.logoContainer}>
                    <Image src="/blockade2.png" alt="CrypSaur Logo" width={972} height={144} className={styles.logoImage} />
                </div>
            </Link>

            <div className={styles.buttonContainer}>
            <Link href={`/project/MyCoins?sec_key=${data_key}`}>
          <button className={styles.customButton}>My Blokkade Coins</button>
          </Link>

                <button className={styles.customButton}>{claimableRewards && (
                            <span>Reward balance: {ethers.utils.formatEther(claimableRewards!)}</span>
)}</button>
                
                <Link href={`/project/MyNFTs?sec_key=${data_key}`}>
                <button className={styles.customButton}>My NFTs</button>
                </Link>

                <Link href={`/project/StakedNFTs?sec_key=${data_key}`}>
                <button className={styles.customButton}>Staked NFTs</button>
                </Link>

                <Link href={`/project/claim?sec_key=${data_key}`}>
                <button className={styles.customButton}>Claim NFTs & Rewards</button>
                </Link>
            </div>

            <div className={styles.connectWalletContainer}>
                <ConnectWallet 
                    btnTitle='Sign In'
                    modalTitle='Select sign in method'
                    detailsBtn={() => (
                        <button className="profileButton">Wallet Connected <br />{displayAddress}</button>
                    )}
                />
            </div>
        </div>
    )
};