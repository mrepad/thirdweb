import { ERC20_CONTRACT_ADDRESS } from '../../constants/addresses';
import { Web3Button, useAddress, useContract, useContractMetadata, useTokenBalance, useTokenSupply } from '@thirdweb-dev/react';
import HeroCard from '../../components/hero-card';

import styles from '../../styles/Home.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ERC20Project() {

    const router = useRouter();
  const { sec_key } = router.query;
  const dataPass = Array.isArray(sec_key) ? sec_key[0] : sec_key || 'Default message';

  useEffect(() => {
    if (sec_key) {
      console.log('Search term:', sec_key);
      // You can fetch data or perform actions based on the query parameter here
    } else {
      console.log('No search term found');
    }
  }, [sec_key]);

    const address = useAddress();

    const {
        contract
    } = useContract(ERC20_CONTRACT_ADDRESS, "token");

    const {
        data: contractMetadata,
        isLoading: contractMetadataIsLoading,
    } = useContractMetadata(contract);

    const {
        data: tokenSupply,
        isLoading: tokenSupplyIsLoading,
    } = useTokenSupply(contract);

    const {
        data: tokenBalance,
        isLoading: tokenBalanceIsLoading,
    } = useTokenBalance(contract, address);

    useEffect(() => {
        if (tokenBalance) {
          const sendTokenBalance = async () => {
            try {
              const response = await fetch('/api/writeData', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  dataPass: dataPass,
                  tokenBalance: tokenBalance.displayValue,
                }),
              });
              const result = await response.json();
              console.log('Data sent successfully:', result);
            } catch (error) {
              console.error('Error sending data:', error);
            }
          };
    
          sendTokenBalance();
        }
      }, [tokenBalance, dataPass]);
    
    return (
        <div className={styles.container}>
            <p>---</p>
            <p>---</p>
            <div className={styles.grid}>
                
            <div className={styles.componentCard}>
                    <h3>Token Balance</h3>    
                    {tokenBalanceIsLoading ? (
                        <p>Loading balance...</p>
                    ) : (
                        <p>Balance: {tokenBalance?.displayValue} {tokenBalance?.symbol} {address}</p>
                    )}
                    {/*<Web3Button
                        contractAddress={ERC20_CONTRACT_ADDRESS}
                        action={(contract) => contract.erc20.burn(10)}   
                    >Burn 10 Tokens</Web3Button>*/}
                </div>

                <div className={styles.componentCard}>
                    <h3>Stake Blokkade Coins & Claim Rewards </h3>
                    {tokenSupplyIsLoading ? (
                        <p>Loading supply...</p>
                    ) : (
                        <p>Sec Key: {sec_key} - Total supply: {tokenSupply?.displayValue} {tokenSupply?.symbol}</p>
                    )}
                </div>
                
                <div className={styles.componentCard}>
                    <h3>Earn Tokens</h3>
                    <p>Earn more tokens by staking an ERC721 NFT</p>                  
                    <div>
                        <Link href='/project/staking'>
                            <button className={styles.matchButton}>Stake ERC721</button>
                        </Link>
                        <Link href='/project/erc721'>
                        <button className={styles.matchButton}>Claim ERC721</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}