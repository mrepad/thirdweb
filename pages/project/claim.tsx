import HeroCard from '../../components/hero-card';
import styles from '../../styles/Home.module.css';
import { ERC1155_CONTRACT_ADDRESS } from '../../constants/addresses';
import { Web3Button, useAddress, useContract, useContractMetadata, useOwnedNFTs, useTotalCirculatingSupply, useTotalCount } from '@thirdweb-dev/react';
import { useRouter } from 'next/router'; // Import useRouter
import { useState, useEffect } from 'react';

export default function ERC1155Project() {
    const router = useRouter();
    const { CS_token } = router.query; // Extracting CS_token
    const csToken = Array.isArray(CS_token) ? CS_token[0] : CS_token || 'Default token'; // Ensure CS_token is always a string
    const csTokenNumber = parseInt(csToken); // Convert csToken to a number

    const address = useAddress();

    const {
        contract
    } = useContract(ERC1155_CONTRACT_ADDRESS, "edition-drop");

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

    return (
        <div className={styles.container}>
            <div className={styles.containerPage}>
                <HeroCard
                    isLoading={contractMetadataIsLoading}
                    title={contractMetadata?.name!}
                    description={contractMetadata?.description!}
                    image={tokenImage || contractMetadata?.image!}
                    />
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