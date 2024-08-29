import HeroCard from '../../components/hero-card';
import styles from '../../styles/Home.module.css';
import { ERC1155_CONTRACT_ADDRESS, STAKING_ERC1155_CONTRACT_ADDRESS } from '../../constants/addresses';
import { Web3Button, useAddress, useContract, useContractMetadata, useOwnedNFTs, useTotalCirculatingSupply, useTotalCount } from '@thirdweb-dev/react';
import { useRouter } from 'next/router'; // Import useRouter
import { useState, useEffect } from 'react';
import { BigNumber, ethers } from 'ethers';

export default function ERC1155Project() {
    const router = useRouter();
    const { CS_token } = router.query; // Extracting CS_token
    const csToken = Array.isArray(CS_token) ? CS_token[0] : CS_token || 'Default token'; // Ensure CS_token is always a string
    const csTokenNumber = parseInt(csToken); // Convert csToken to a number

    const address = useAddress();

    const {
        contract
    } = useContract(ERC1155_CONTRACT_ADDRESS, "edition-drop");

    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();

    const {
        data: contractMetadata,
        isLoading: contractMetadataIsLoading,
    } = useContractMetadata(contract);

    const {
        data: contractNFTSupply,
        isLoading: contractNFTSupplyIsLoading,
    } = useTotalCount(contract);

    const {
        data: totalCirculatingSupply,
        isLoading: totalCirculatingSupplyIsLoading,
    } = useTotalCirculatingSupply(contract, 0);

    const {
        data: ownedNFTs,
        isLoading: ownedNFTsIsLoading,
    } = useOwnedNFTs(contract, address);

    const [tokenImage, setTokenImage] = useState<string | null>(null);

    useEffect(() => {
        if (ownedNFTs && ownedNFTs.length > 0) {
            const token = ownedNFTs.find(nft => parseInt(nft.metadata.id) === csTokenNumber);
            if (token) {
                setTokenImage(token.metadata.image ?? null);
            }
        }
    }, [ownedNFTs, csTokenNumber]);

    const {
        contract: stakingContract
      } = useContract(STAKING_ERC1155_CONTRACT_ADDRESS);
    

      useEffect(() => {
        if (!stakingContract || !address) return;
      
        async function getClaimableRewards() {
            try {
                const stakeInfo = await stakingContract?.call("getStakeInfo", [address]);
                if (stakeInfo && stakeInfo[2]) {
                    setClaimableRewards(stakeInfo[2]);
                }
            } catch (error) {
                console.error("Error fetching claimable rewards:", error);
            }
        };
      
        getClaimableRewards();
    }, [address, stakingContract]);

    return (
        <div className={styles.container}>
            <div className={styles.containerPage}>
            <p>---</p>
            <p>---</p>
                <div className={styles.grid}>
                    <div className={styles.componentCard}>
                        <h3>Claim Staking Rewards</h3>
                        {claimableRewards !== undefined ? (
                            <p>Claim Reward balance: {ethers.utils.formatEther(claimableRewards)}</p>
                        ) : (
                            <p>Loading reward balance...</p>
                        )}
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
                    </div>                    
                </div>

                <div className={styles.grid}>
                <div className={styles.componentCard}>
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
 </div>                    
 </div>

                <div className={styles.grid}>
                    <div className={styles.componentCard}>
                        <h3>Claim ERC1155</h3>
                        <p>Claim an ERC1155 NFT for 10 tokens</p>
                        <Web3Button
                            contractAddress={ERC1155_CONTRACT_ADDRESS}
                            action={(contract) => contract.erc1155.claim(csToken , 1)}
                            // 1st number is the ID, second number in brackets is the quantity
                        >Claim NFT {csToken }</Web3Button>
                    </div>                    
                </div>

            </div>
        </div>
    )
}