import { useAddress, useContract, useOwnedNFTs } from '@thirdweb-dev/react';
import styles from '../../styles/Home.module.css';
import { ERC1155_CONTRACT_ADDRESS, STAKING_ERC1155_CONTRACT_ADDRESS } from '../../constants/addresses';
import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import StakeNFTCard from '../../components/cs-stake-card';
import { useRouter } from 'next/router'; // Import useRouter

export default function StakingProject() {
    const router = useRouter();
    const { CS_token } = router.query; // Extracting CS_token
    const csToken = Array.isArray(CS_token) ? CS_token[0] : CS_token || 'Default token'; // Ensure CS_token is always a string

    const address = useAddress();
    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
    
    const {
        contract: stakingContract
    } = useContract(STAKING_ERC1155_CONTRACT_ADDRESS);

    const {
        contract: ERC1155Contract
    } = useContract(ERC1155_CONTRACT_ADDRESS);

    const {
        data: ownedERC1155NFTs,
        isLoading: ownedERC1155NFTsIsLoading,
    } = useOwnedNFTs(ERC1155Contract, address);

    

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

    console.log('Reward balance2: ', {claimableRewards});
   

    return (
        <div className={styles.container}>
            <div className={styles.contractPage}>
               
                <div className={styles.grid}>
                    
                    <div className={styles.componentCard}>
                        <h3>Unstaked</h3>
                        {ownedERC1155NFTsIsLoading ? (
                            <p>Loading...</p>
                        ) : (
                            ownedERC1155NFTs && ownedERC1155NFTs.length > 0 ? (
                                ownedERC1155NFTs.map((nft) => (
                                    <div key={nft.metadata.id} className={styles.nftGrid}>
                                        <StakeNFTCard
                                            nft={nft}
                                            cs_token={csToken} // Pass CS_token to StakeNFTCard
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>No NFTs owned</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
        )
    }