// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import Button from "../shared/Button";
import Input from "../shared/Input";
import toast from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { WebBundlr } from "@bundlr-network/client";
import { useProgram, useMintNFT } from "@thirdweb-dev/react/solana";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import BigNumber from "bignumber.js";
import FundModal from "../FundModal";
import fileReaderStream from "filereader-stream";
import Success from "../Success";
import axios from "axios";
import { useReward } from "react-rewards";

export default function Hero() {
  const [name, setName] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | undefined>(undefined);
  const { publicKey } = useWallet();
  const { program } = useProgram(
    "GAjMpbjrAfm8uPNwQs5HfCWECCgi7ZGXnt4UhidVRkUm",
    "nft-collection"
  ) as any;
  const [bundlr, setBundlr] = useState<WebBundlr | undefined>(undefined);
  const [price, setPrice] = useState<string | undefined>(undefined);
  const [showFundWallet, setShowFundWallet] = useState(false);
  const [stream, setStream] = React.useState<ReadableStream>();
  const { mutateAsync: mintNFT } = useMintNFT(program);
  const [arweaveId, setArweaveId] = useState<string | undefined>(undefined);
  const { reward, isAnimating } = useReward("rewardId", "confetti");
  const { reward: reward2, isAnimating: isAnimating2 } = useReward(
    "rewardId2",
    "confetti"
  );
  const { reward: reward3, isAnimating: isAnimating3 } = useReward(
    "rewardId3",
    "confetti"
  );
  const { reward: reward4, isAnimating: isAnimating4 } = useReward(
    "rewardId4",
    "confetti"
  );
  const { reward: reward5, isAnimating: isAnimating5 } = useReward(
    "rewardId5",
    "confetti"
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const rewardRef = useRef();
  const bundlerHttpAddress = "https://node1.bundlr.network";
  const currency = "solana";

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMint = async () => {
    // setLoading(true);
    if (!publicKey) {
      toast("Please connect your wallet to continue", {
        icon: "🔒",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }
    if (!name || !description || !file) {
      toast("Please fill all the fields", {
        icon: "📝",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }
    const isOver10GB = file?.size > 10 * 1024 * 1024 * 1024;
    if (isOver10GB) {
      alert("File size is over 10GB");
      return;
    } else {
      const shouldFund = await hasEnoughBalance();
      console.log(shouldFund);
      if (shouldFund.status) {
        setShowFundWallet(true);
        setPrice(roundUp(shouldFund.toFund));
      } else {
        uploadVideo();
      }
    }
  };

  function roundUp(num) {
    return Math.ceil(num * 100000) / 100000;
  }

  const parseInput = (input: string | number) => {
    const conv = new BigNumber(input).multipliedBy(
      bundlr!.currencyConfig.base[1]
    );
    if (conv.isLessThan(1)) {
      alert("Amount is too small");
      return;
    }
    return conv;
  };

  const fundWallet = async () => {
    if (bundlr && price) {
      const value = parseInput(price);
      if (!value) return;
      await bundlr
        .fund(value)
        .then((res) => {
          setShowFundWallet(false);
          toast("Wallet funded successfully", {
            icon: "🎉",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          uploadVideo();
        })
        .catch((e) => {
          console.log("Funding failed", e);
        });
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0]);
    setStream(fileReaderStream(e.target.files?.[0]));
  };

  const hasEnoughBalance = async () => {
    let accountBalance = (await bundlr?.getLoadedBalance()) as any;
    let price = (await bundlr?.getPrice(file?.size)) as any;

    accountBalance = accountBalance.toString();
    price = price.toString();

    accountBalance = bundlr?.utils
      .unitConverter(accountBalance)
      .toFixed(7, 2)
      .toString();
    price = bundlr?.utils.unitConverter(price).toString();

    if (parseFloat(accountBalance) < parseFloat(price)) {
      return {
        status: true,
        toFund: parseFloat(price) - parseFloat(accountBalance),
      };
    }
    return {
      status: false,
      toFund: 0,
    };
  };

  const mint = async (id: string) => {
    toast("Minting NFT, please approve the transaction", {
      icon: "🔥",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
    mintNFT?.({
      metadata: {
        name,
        description,
        image: `https://arweave.net/${id}`,
        animation_url: `https://arweave.net/${id}`,
        external_url: `https://lvpr.tv/?muted=0&v=${id}`,
        properties: {
          video: `ar://${id}`,
        },
      },
    }).then(async (e) => {
      const { data } = await axios.get(`https://arweave.net/${id}`);
      if (data) {
        setLoading(false);
        rewardRef.current?.click();
        setShowSuccessModal(true);
      }
    });
  };

  const uploadVideo = async () => {
    if (stream) {
      toast("Uploading video, please wait", {
        icon: "⏳",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      const dataStream = fileReaderStream(file);
      const tx = await bundlr?.uploader?.upload(dataStream, {
        tags: [{ name: "Content-Type", value: file?.type }],
      });
      if (tx?.data?.id) {
        console.log("tx", tx.data.id);
        setArweaveId(tx.data?.id);
        mint(tx.data.id);
      }
    }
  };

  const initBundlr = async () => {
    if (publicKey?.toBase58()) {
      const provider = new PhantomWalletAdapter();
      await provider.connect();
      const bundlr = new WebBundlr(bundlerHttpAddress, currency, provider, {
        providerUrl:
          "https://solana-mainnet.g.alchemy.com/v2/lqJNpg_IYUwHGwO6jPcrI7abZhueH9mv",
      });
      try {
        await bundlr.utils.getBundlerAddress(currency);
      } catch {
        toast("An error occured, please try again", {
          icon: "🔒",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        return;
      }
      try {
        await bundlr.ready();
      } catch (err) {
        console.log(err);
      }
      toast("Connected to Bundlr Network", {
        icon: "🔒",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setBundlr(bundlr);
    } else {
      console.log("not");
    }
  };

  useEffect(() => {
    initBundlr();
  }, [publicKey]);

  return (
    <section className="p-10 h-screen flex flex-col lg:flex-row">
      <div className="w-full h-1/2  lg:h-full lg:w-1/2">
        <img
          src="/hero.png"
          className=" w-full h-full  lg:h-full object-cover rounded-xl object-bottom"
        />
      </div>
      <div className="lg:w-1/2 w-full h-full lg:ml-20">
        <p className="text-base font-light text-primary lg:mt-20 mt-5">
          Livepeer x Solana
        </p>
        <h1 className="text-6xl font-bold font-MontHeavy text-gray-100 mt-6">
          Unlock the Potential of Video NFTs Today.
        </h1>
        <p className="text-base font-light text-gray-500 mt-6">
          Looking to turn your video files into unique, collectible NFTs? With
          Long Take NFT Publisher, you can easily create and share NFTs from
          files up to 10GB on any NFT marketplace on Solana. With Livepeer, you
          can ensure that your video NFTs will have seamless playback for
          viewers on all bandwidths and device types.
        </p>
        <div className="flex flex-col mt-6">
          <Input
            onChange={(e) => setName(e.target.value)}
            placeholder={"Enter the name of your NFT"}
          />
          <div className="h-4" />
          <Input
            onChange={(e) => setDescription(e.target.value)}
            textarea={true}
            placeholder={"Enter the description of your NFT"}
          />
          <div className="h-4" />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full border border-dashed border-gray-500 rounded-xl p-4 flex items-center justify-center"
          >
            <p className="text-gray-500">
              {file ? (
                file.name +
                " - " +
                Number(file.size / 1024 / 1024).toFixed() +
                " MB"
              ) : (
                <>Choose a video file to upload</>
              )}
            </p>
          </div>
          <input
            onChange={handleOnChange}
            type="file"
            accept="video/*"
            ref={fileInputRef}
            hidden
          />
        </div>
        <button
          disabled={isAnimating}
          ref={rewardRef}
          onClick={() => {
            reward();
            reward2();
            reward3();
            reward4();
            reward5();
          }}
        >
          <span id="rewardId" />
          <span id="rewardId2" />
          <span id="rewardId3" />
          <span id="rewardId4" />
          <span id="rewardId5" />
        </button>
        <div className="flex flex-row items-center mb-20 lg:mb-0">
          <Button onClick={handleMint} disable={!name || !description || !file}>
            {loading ? "Minting..." : "Mint NFT"}
          </Button>
          <p className="self-center ml-4 text-gray-500 mt-5 capitalize"></p>
        </div>
      </div>
      {showFundWallet && (
        <FundModal
          onFund={fundWallet}
          file={file}
          price={price}
          onClose={() => setShowFundWallet(false)}
        />
      )}
      {showSuccessModal && <Success name={name} arweaveId={arweaveId} />}
    </section>
  );
}
