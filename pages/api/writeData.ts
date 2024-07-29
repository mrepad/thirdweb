import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface ExistingData {
  sec_key?: string;
  tokenBalance?: string;
  connectionStatus?: string;
  address?: string;
  rewardBalance?: string;
  AvNFTs?: { AvId: string; quantityOwned: string }[];
  stakedNFTs?: { stakedId: string; quantityOwned: string }[];
}

interface NFTData {
  AvId: string;
  stakedId?: string;
  quantityOwned: string;
}

// Simple write queue
const writeQueue: { filePath: string; tempFilePath: string; data: ExistingData; res: NextApiResponse }[] = [];
let isWriting = false;

const processQueue = () => {
  if (writeQueue.length === 0 || isWriting) return;

  isWriting = true;
  const { filePath, tempFilePath, data, res } = writeQueue.shift()!;
  
  fs.writeFile(tempFilePath, JSON.stringify(data, null, 2), (writeErr) => {
    if (writeErr) {
      isWriting = false;
      console.error('Error writing temp file:', writeErr);
      res.status(500).json({ message: 'Internal Server Error' });
      processQueue();
      return;
    }

    fs.rename(tempFilePath, filePath, (renameErr) => {
      isWriting = false;

      if (renameErr) {
        console.error('Error renaming file:', renameErr);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        console.log('File written successfully:', filePath);
        res.status(200).json({ message: 'File written successfully' });
      }

      processQueue();
    });
  });
};


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log('Received data:', req.body);
  }

  const { sec_key, tokenBalance, connectionStatus, address, rewardBalance, AvNFTs, stakedId, quantityOwned, source } = req.body;

  console.log(`ReceivedAA data from ${source}:`, req.body);
  console.log(`ReceivedAB data from ${source}:`, sec_key);
  //console.log(`ReceivedAB data from ${source}:`, AvId);
  console.log(`ReceivedAB data from ${source}:`, quantityOwned);
  console.log(`--------`);
  console.log(`--------`);

  

  if (!sec_key) {
    console.log('Missing sec_key');
    return res.status(400).json({ message: 'Missing sec_key' });
}

// Log the sec_key and other parameters
console.log(`sec_keyZ: ${sec_key}`);
console.log(`Path: ${path.join(process.cwd(), 'public', `${sec_key}.json`)}`);


  // Path to the file in the public directory
  const filePath = path.join(process.cwd(), 'public', `${sec_key}.json`);
  const tempFilePath = `${filePath}.tmp`;

  console.log('File path:', filePath);

 // Read the existing file content
 fs.readFile(filePath, 'utf8', (err, data) => {
  let existingData: ExistingData = {};

  if (err) {
      console.log('Error reading file:', err);
  } else {
      existingData = JSON.parse(data);
  }

  // Log existing data
  console.log('Existing data:', existingData);

  // Merge existing data with new data based on source
  let updatedData: ExistingData = { ...existingData };

  if (source === 'Button') {
    updatedData = {
      ...existingData,
      sec_key: sec_key || existingData.sec_key,
      tokenBalance: tokenBalance !== undefined ? tokenBalance : existingData.tokenBalance,
      connectionStatus: connectionStatus !== undefined ? connectionStatus : existingData.connectionStatus,
      address: address !== undefined ? address : existingData.address,
      rewardBalance: rewardBalance !== undefined ? rewardBalance : existingData.rewardBalance,
      AvNFTs: existingData.AvNFTs || [],
  };
} else if (source === 'StakeNFTCard') {
  const newAvailableNFTs: { AvId: string; quantityOwned: string }[] = AvNFTs.map((nft: any) => ({
    AvId: nft.AvId,
    quantityOwned: nft.quantityOwned,
  }));
  const AvNFTsMap = new Map<string, { AvId: string; quantityOwned: string }>(existingData.AvNFTs?.map(nft => [nft.AvId, nft]) || []);
  
  newAvailableNFTs.forEach(nft => {
    AvNFTsMap.set(nft.AvId, nft);
  });

  updatedData = {
    ...existingData,
    sec_key: sec_key ?? existingData.sec_key,
    AvNFTs: Array.from(AvNFTsMap.values()),
  };
} else if (source === 'StakedNFTCard') {
  const newStakedNFTs: { stakedId: string; quantityOwned: string }[] = stakedId.map((id: string, index: number) => ({
  stakedId: id,
  quantityOwned: quantityOwned[index],
}));
const stakedNFTsMap = new Map<string, { stakedId: string; quantityOwned: string }>(existingData.stakedNFTs?.map(nft => [nft.stakedId, nft]) || []);

newStakedNFTs.forEach(nft => {
  stakedNFTsMap.set(nft.stakedId, nft);
});

updatedData = {
  ...existingData,
  sec_key: sec_key ?? existingData.sec_key,
  stakedNFTs: Array.from(stakedNFTsMap.values()),
};
}

// Log updated data
console.log('Updated data to be written:', updatedData);

    // Add write operation to the queue
    writeQueue.push({ filePath, tempFilePath, data: updatedData, res });
    processQueue();
  });
}
