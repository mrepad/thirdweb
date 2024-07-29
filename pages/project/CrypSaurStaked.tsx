import { Web3Button, useAddress, useContract, useContractMetadata, useContractRead, useOwnedNFTs, useTokenBalance } from '@thirdweb-dev/react';
import styles from '../../styles/Home.module.css';
import { ERC20_CONTRACT_ADDRESS, ERC1155_CONTRACT_ADDRESS, STAKING_ERC1155_CONTRACT_ADDRESS } from '../../constants/addresses';
import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import StakedNFTCard from '../../components/cs-staked-card';
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
        contract: ERC20Contract
    } = useContract(ERC20_CONTRACT_ADDRESS);
    const {
        contract: ERC1155Contract
    } = useContract(ERC1155_CONTRACT_ADDRESS);
    
    const {
        data: stakingContractMetadata,
        isLoading: stakingContractMetadataIsLoading,
    } = useContractMetadata(stakingContract);

    const {
        data: tokenBalance,
        isLoading: tokenBalanceIsLoading,
    } = useTokenBalance(ERC20Contract, address);

    const {
        data: ownedERC1155NFTs,
        isLoading: ownedERC1155NFTsIsLoading,
    } = useOwnedNFTs(ERC1155Contract, address);

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

    console.log('Reward balance2: ', {claimableRewards});
   

    return (
        <div className={styles.container}>
            <div className={styles.contractPage}>
                <div className={styles.grid}>
                    <div className={styles.componentCard}>
                        <h3>Staked</h3>
                        {isStakedERC1155TokensLoading ? (
                            <p>Loading...</p>
                        ) : (
                            stakedERC1155Tokens && stakedERC1155Tokens.length > 0 ? (
                                stakedERC1155Tokens[0].map((stakedNFT: BigNumber, index: number) => (
                                    <div key={index} className={styles.nftGrid}>
                                        <StakedNFTCard
                                            tokenId={stakedNFT.toNumber()}
                                            cs_token={csToken} // Pass CS_token to StakeNFTCard
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>No NFTs staked</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
        )
    }