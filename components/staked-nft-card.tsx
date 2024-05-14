import { ThirdwebNftMedia, Web3Button, useContract, useNFT } from "@thirdweb-dev/react";
import styles from '../styles/Home.module.css';
import { ERC721_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS } from "../constants/addresses";

type NFTProps = {
    tokenId: number;
};

export default function StakedNFTCard({ tokenId }: NFTProps) {
    const {
        contract: ERC721Contract
    } = useContract(ERC721_CONTRACT_ADDRESS, "signature-drop");
    const {
        contract: stakingContract
    } = useContract(STAKING_CONTRACT_ADDRESS);

    const {
        data: nftMetadata,
        isLoading: nftMetadataIsLoading,
    } = useNFT(ERC721Contract, tokenId);

    return (
    <div className={styles.card}>

        {nftMetadataIsLoading ? (
            "Loading..."
                ) : (                
            <ThirdwebNftMedia
            metadata={nftMetadata?.metadata!}
            width="100%"
            height="auto"
            />
        )}
        <div className={styles.nftInfoContainer}>
            <p className={styles.nftName}>aa</p>
            <p className={styles.nftTokenId}>Token: #</p>
        </div>
        <Web3Button
                contractAddress={STAKING_CONTRACT_ADDRESS}
                action={(contract) => contract.call(
                    "withdraw",
                    [[tokenId]]
                )}
                style={{
                    width: "100%",
                }}
            >Unstake</Web3Button>
    </div>
    )
}