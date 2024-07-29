import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { ConnectWallet } from '@thirdweb-dev/react';
import Image from 'next/image';

export default function Navbar() {
    return (
        <div className={styles.navbar}>
            <Link href="/">
                <p 
                    className={styles.gradientText1}
                    style={{
                        cursor: 'pointer',
                        fontSize: '1.2 rem',
                        fontWeight: 'bold'
                    }}>
                    <Image src="/Blokkade.png" alt="CrypSaur Logo" width={200} height={100}  />
                </p>
            </Link>
            <ConnectWallet 
            btnTitle='Sign In'
            modalTitle='Select sign in method'
            detailsBtn={() => {
                return <p>Profile</p>
            }}
            />
        </div>
    )
};