import { Web3Button, useAddress, useContract, useContractMetadata, useContractRead, useOwnedNFTs, useTokenBalance } from '@thirdweb-dev/react';
import styles from '../../styles/Home.module.css';
import { ERC20_CONTRACT_ADDRESS, ERC1155_CONTRACT_ADDRESS, STAKING_ERC1155_CONTRACT_ADDRESS } from '../../constants/addresses';
import HeroCard from '../../components/hero-card';
import { useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import StakeNFTCard from '../../components/stake-nft1155-card';
import StakedNFTCard from '../../components/staked-nft1155-card';

export default function StakingProject() {
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
                <HeroCard
                 isLoading={stakingContractMetadataIsLoading}
                 title={stakingContractMetadata?.name!}
                 description={stakingContractMetadata?.description!}
                 image={stakingContractMetadata?.image!}
                />
                <div className={styles.grid}>
                    <div className={styles.componentCard}>
                        <h3>Rewards</h3>
                        {tokenBalanceIsLoading ? (
                            <p>Loading balance...</p>
                        ) : (
                            <p>Balance: {tokenBalance?.displayValue} {tokenBalance?.symbol}</p>
                        )}
                        
                       
                        {claimableRewards && (
                            <p>Reward balance: {ethers.utils.formatEther(claimableRewards!)}</p>
                        
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
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>No NFTs owned</p>
                            )
                        )}
                    </div>
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