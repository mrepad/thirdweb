// components/SendDataButton.tsx
import { useEffect } from 'react';
//import { useConnectionStatus } from "@thirdweb-dev/react";

type SendDataButtonProps = {
    sec_key: string;
    connectionStatus: string;
    address: string | undefined;
    tokenBalance: string | undefined;
    rewardBalance: string | undefined;
  };

const  message = 'Big22 Hello from Next.js';
//const connectionStatus = useConnectionStatus();


const SendDataButton: React.FC<SendDataButtonProps> = ({ sec_key, connectionStatus, address, tokenBalance, rewardBalance }) => {
    console.log('Received data:2', { connectionStatus, sec_key, });

    useEffect(() => {
        if (connectionStatus === 'connected' && sec_key) {

    const sendData = async () => {
        console.log('Data written to file successfully');
        try {
        //const data = { sec_key };
        const response = await fetch('/api/writeData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            
            body: JSON.stringify({
                sec_key,  // Pass sec_key from props
                connectionStatus,
                address,
                tokenBalance,
                 rewardBalance,
                source: 'Button'  // Add source field
            }),
        });

        if (response.ok) {
            console.log('Data written to file successfully');
        } else {
            console.error('Failed to write data to file');
        }   
     }   catch (error) {
            console.error('Error sending data:', error);
        }
    

    };

    sendData();
     }

    }, [sec_key, connectionStatus, address, tokenBalance, rewardBalance]);
    return null;


};

export default SendDataButton;
