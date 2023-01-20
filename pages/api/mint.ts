import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, metadata } = JSON.parse(req.body);

  const sdk = ThirdwebSDK.fromPrivateKey(
    "mainnet-beta",
    process.env.PRIVATE_KEY as string
  );

  const collection = await sdk.getNFTCollection(
    "GAjMpbjrAfm8uPNwQs5HfCWECCgi7ZGXnt4UhidVRkUm"
  );

  const nfts = await collection?.getAll();

  const nft = await collection.mintTo(address, metadata);

  console.log(nft);

  res.status(200).json({ nft });
};

export default handler;
