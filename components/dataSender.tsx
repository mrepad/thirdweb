import { useEffect } from 'react';
console.log(`Updated1a`);
type DataSenderProps = {
  sec_key: string | null;
  connectionStatus: string;
  address: string | undefined;
  tokenBalance: string | undefined;
  rewardBalance: string | undefined;
  
};

console.log(`Updated2a`);

const DataSender: React.FC<DataSenderProps> = ({ sec_key, connectionStatus, address, tokenBalance, rewardBalance }) => {
  console.log(`Updated sec_key from query: ${sec_key}`);
  useEffect(() => {
    if (sec_key && connectionStatus && address && tokenBalance && rewardBalance) {
      const sendTokenBalance = async () => {
        try {
          const response = await fetch('/api/writeData', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sec_key,
              connectionStatus,
              address,
              tokenBalance,
              rewardBalance,
              source: 'index',
            }),
          });
          const result = await response.json();
          console.log('Data sent successfully:', result);
        } catch (error) {
          console.error('Error sending data:', error);
        }
      };

      sendTokenBalance();
    }
  }, [sec_key, connectionStatus, address, tokenBalance, rewardBalance]);

  return null;
};

export default DataSender;
