import Link from "next/link";
import styles from "../styles/Home.module.css";
import { MediaRenderer, useContract, useContractMetadata } from "@thirdweb-dev/react";

type CardProps = {
    href: string;
    contractAddress: string;
    title: string | undefined;
    description: string | undefined;
}

export default function ContractCard(props: CardProps) {
    const {
        contract
    } = useContract(props.contractAddress);

    const {
        data: contractMetadata,
    } = useContractMetadata(contract);

    return (
        <Link
            href={props.href}
            className={styles.card}
            >
                
                <div className={styles.cardText}>
                    <h2 className={styles.gradientText1}>{props.title}</h2>
                    <p>{props.description}</p>
                </div>
            </Link>
    )
}