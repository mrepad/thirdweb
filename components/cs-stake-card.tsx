import { useEffect, useState } from 'react';
import { NFT } from "@thirdweb-dev/sdk";
import styles from '../styles/Home.module.css';
import { ThirdwebNftMedia, useOwnedNFTs, Web3Button, useAddress, useContract } from '@thirdweb-dev/react';
import { ERC1155_CONTRACT_ADDRESS, STAKING_ERC1155_CONTRACT_ADDRESS } from "../constants/addresses";

type NFTProps = {
    nft: NFT;
    cs_token: string;
};

export default function StakeNFTCard({ nft, cs_token }: NFTProps) {
    const address = useAddress();
    console.log('Address:', address);

    const { contract: stakingContract } = useContract(STAKING_ERC1155_CONTRACT_ADDRESS);
    const { contract: ERC1155Contract } = useContract(ERC1155_CONTRACT_ADDRESS, "edition-drop");

    const { data: ownedNFTs, isLoading: ownedNFTsIsLoading } = useOwnedNFTs(ERC1155Contract, address);
    console.log('ownedNFTs:', ownedNFTs);

    const [allNFTs, setAllNFTs] = useState<{ AvId: string; quantityOwned: string }[]>([]);
    const [isDataSent, setIsDataSent] = useState(false);

    useEffect(() => {
        if (ownedNFTs && ownedNFTs.length > 0) {
            const updatedNFTs = ownedNFTs.map(item => ({
                AvId: item.metadata.id,
                quantityOwned: item.quantityOwned ? item.quantityOwned.toString() : '0',
            }));
            setAllNFTs(updatedNFTs);
        }
    }, [ownedNFTs]);


    async function stakeNFT(nftId: number[]) {
        if (!address) return;

        const isApproved = await ERC1155Contract?.isApproved(address, STAKING_ERC1155_CONTRACT_ADDRESS);

        if (!isApproved) {
            await ERC1155Contract?.setApprovalForAll(STAKING_ERC1155_CONTRACT_ADDRESS, true);
        }

        await stakingContract?.call("stake", [nftId, 1]);
    };

    return (
        nft.metadata.id === cs_token && (
            <div className={styles.card}>
                <ThirdwebNftMedia metadata={nft.metadata} width="300px" height="450px" />
                <div className={styles.nftInfoContainer}>
                    <p className={styles.nftName}>{nft.metadata.name}</p>
                    <p className={styles.nftAvId}>Token ID#{nft.metadata.id}</p>
                    {ownedNFTsIsLoading ? "Loading..." : (
                        ownedNFTs && ownedNFTs.length > 0 ? (
                            <p key={nft.metadata.id}>AvId#{nft.metadata.id} Owned: {nft.quantityOwned}</p>
                        ) : (
                            <p>No NFTs owned</p>
                        )
                    )}
                </div>
                <Web3Button
                    contractAddress={STAKING_ERC1155_CONTRACT_ADDRESS}
                    action={() => stakeNFT([parseInt(nft.metadata.id)])}
                    style={{ width: "100%" }}
                >Stake</Web3Button>
            </div>
        )
    );
}