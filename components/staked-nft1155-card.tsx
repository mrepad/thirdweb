import { ThirdwebNftMedia, useContractRead, useAddress, Web3Button, useOwnedNFTs, useContract, useNFT } from "@thirdweb-dev/react";
import styles from '../styles/Home.module.css';
import { ERC1155_CONTRACT_ADDRESS, STAKING_ERC1155_CONTRACT_ADDRESS } from "../constants/addresses";
import { useEffect, useState } from "react";
import { BigNumber } from "ethers";

type NFTProps = {
    tokenId: number;
    sec_key: string;
};

export default function StakedNFTCard({ tokenId, sec_key }: NFTProps) {
    const address = useAddress();
    const [quantityStaked, setQuantityStaked] = useState<BigNumber>();


    const {
        contract: ERC1155Contract,
        error: ERC1155ContractError
    } = useContract(ERC1155_CONTRACT_ADDRESS, "edition-drop");

    const {
        contract: stakingContract,
        error: stakingContractError
    } = useContract(STAKING_ERC1155_CONTRACT_ADDRESS);

    const {
        data: nftMetadata,
        isLoading: nftMetadataIsLoading,
    } = useNFT(ERC1155Contract, tokenId);

    const {
        data: ownedNFTs,
        isLoading: ownedNFTsIsLoading,
    } = useOwnedNFTs(ERC1155Contract, address);

    
    const { data: stakeInfo, 
        isLoading: stakeInfoLoading,
    } = useContractRead(
    stakingContract,
    "getStakeInfoForToken",
    [tokenId, address]
    );

    useEffect(() => {
        if (stakeInfo) {
            setQuantityStaked(stakeInfo[0]); // Assuming the quantity is the first element in the array
        }
    }, [stakeInfo]);

    useEffect(() => {
        if (quantityStaked) {
            const sendNFTData = async () => {
                try {
                    console.log('Sending staked data to /api/writeData');
                    const response = await fetch('/api/writeData', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            sec_key,  // Pass sec_key from props
                            stakedId: [tokenId.toString()],
                            quantityOwned: [quantityStaked.toString()],
                            source: 'StakedNFTCard'  // Add source field
                        }),
                    });
                    const result = await response.json();
                    console.log('Staked data sent successfully:', result);
                } catch (error) {
                    console.error('Error sending staked data:', error);
                }
            };

            sendNFTData();
        }
    }, [quantityStaked, sec_key, tokenId]);

    //async function unstakeNFT(nftId: number) {
    //    if (!address) return;

    //    await stakingContract?.call("withdraw", [nftId, 1]);
   // }

        return (
    <div className={styles.card}>

        {nftMetadataIsLoading ? (
            "Loading..."
                ) : (                
            <ThirdwebNftMedia
            metadata={nftMetadata?.metadata!}
            width="300px"
            height="450px"
            />
        )}
        <div className={styles.nftInfoContainer}>
            <p className={styles.nftName}>aa</p>
            <p className={styles.nftTokenId}>Token: #{tokenId} Qty: {quantityStaked?.toString()}</p>
            
                {stakeInfoLoading ? (
                <p>Loading staked information...</p>
                 ) : (
                 <p>Staked Quantity: {stakeInfo ? (stakeInfo[0]).toString() : 0}</p>
                )}
        </div>
        
        <Web3Button
                contractAddress={STAKING_ERC1155_CONTRACT_ADDRESS}
                
                action={async (contract) => {
                    console.log("Attempting to call withdraw with tokenId:", tokenId, "and quantityStaked:", quantityStaked?.toString()); // Debugging log
                    try {
                        await contract.call(
                            "withdraw",
                            [tokenId, 1]
                        );
                        
                        console.log("Withdraw successful"); // Debugging log
                    } catch (error) {
                        console.error("Withdraw failed", error); // Debugging log
                    }
                }}
                style={{
                    width: "100%",
                }}
            >Unstake</Web3Button>

            
    </div>
    )
}