// @ts-nocheck

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Button from "../shared/Button";
import Input from "../shared/Input";
import toast from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { WebBundlr } from "@bundlr-network/client";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import BigNumber from "bignumber.js";
import FundModal from "../FundModal";
import fileReaderStream from "filereader-stream";
import Success from "../Success";
import axios from "axios";
import { useReward } from "react-rewards";
import Image from "next/image";
import MintFromTx from "../MintFromTx";
import Steps from "../Steps";

const bundlerHttpAddress = "https://node1.bundlr.network";
const currency = "solana";

export default function Hero() {
  // Inputs
  const [name, setName] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | undefined>(undefined);

  // Bundlr
  const [bundlr, setBundlr] = useState<WebBundlr | undefined>(undefined);
  const [stream, setStream] = React.useState<ReadableStream>();
  const [price, setPrice] = useState<string | undefined>(undefined);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileSize, setFileSize] = useState<number>(0);
  const totalChunks = useRef(0);

  // Modals
  const [showFundWallet, setShowFundWallet] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showTxModal, setShowTxModal] = useState<boolean>(false);

  // Misc
  const { publicKey } = useWallet();
  const [arweaveId, setArweaveId] = useState<string | undefined>(undefined);
  const { reward, isAnimating } = useReward("rewardId", "confetti");
  const [loading, setLoading] = useState<boolean>(false);

  // Refs
  const rewardRef = useRef();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMint = async () => {
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
      setLoading(true);

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

  const handleMintFromTx = async (tx: string) => {
    setLoading(true);
    setArweaveId(tx);
    mint(tx);
    setShowTxModal(false);
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
    toast("Minting NFT, please wait", {
      icon: "🔥",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
    const res = await fetch("/api/mint", {
      method: "POST",
      body: JSON.stringify({
        address: publicKey?.toBase58(),
        metadata: {
          name: name || "Untitled",
          description: description || "No description",
          image: `https://arweave.net/${id}`,
          animation_url: `https://arweave.net/${id}`,
          external_url: `https://lvpr.tv/?muted=0&v=${id}`,
          properties: {
            video: `ar://${id}`,
          },
        },
      }),
    });
    const data = await res.json();

    if (data.nft) {
      const { data } = await axios.get(`https://arweave.net/${id}`);
      if (data) {
        setLoading(false);
        rewardRef.current?.click();
        setShowSuccessModal(true);
      }
    }
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

      const uploader = bundlr.uploader.chunkedUploader;
      // Change the batch size to 1 to make testing easier (default is 5)
      uploader.setBatchSize(1);
      // Change the chunk size to something small to make testing easier (default is 25MB)
      const chunkSize = 2000000;
      uploader.setChunkSize(chunkSize);
      // get a create a streamed reader
      const dataStream = fileReaderStream(file);
      // save a reference to the file size
      setFileSize(dataStream.size);
      // divide the total file size by the size of each chunk we'll upload
      if (dataStream.size < chunkSize) totalChunks.current = 1;
      else {
        totalChunks.current = Math.floor(dataStream.size / chunkSize);
      }
      /** Register Event Callbacks */
      // event callback: called for every chunk uploaded
      uploader.on("chunkUpload", (chunkInfo) => {
        console.log(chunkInfo);
        console.log(
          `Uploaded Chunk number ${chunkInfo.id}, offset of ${chunkInfo.offset}, size ${chunkInfo.size} Bytes, with a total of ${chunkInfo.totalUploaded} bytes uploaded.`
        );
        const chunkNumber = chunkInfo.id + 1;
        // update the progress bar based on how much has been uploaded
        if (chunkNumber >= totalChunks) setUploadProgress(100);
        else setUploadProgress((chunkNumber / totalChunks.current) * 100);
      });
      // event callback: called if an error happens
      uploader.on("chunkError", (e) => {
        console.error(
          `Error uploading chunk number ${e.id} - ${e.res.statusText}`
        );
      });
      // event callback: called when file is fully uploaded
      uploader.on("done", (finishRes) => {
        console.log(`Upload completed with ID ${finishRes.id}`);
        // set the progress bar to 100
        setUploadProgress(100);
      });

      const tx = await uploader.uploadData(dataStream, {
        tags: [{ name: "Content-Type", value: file?.type }],
      });

      if (tx?.data?.id) {
        setArweaveId(tx.data?.id);

        toast(`Tx: ${tx?.data?.id} `, {
          icon: "📝",
          style: {
            borderRadius: "10px",
            background: "#333",
            width: "35rem",
            maxWidth: "100%",
            color: "#fff",
          },
        });
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
      <div className="w-full h-1/2 lg:h-full lg:w-1/2">
        <Image
          src="/hero.png"
          className=" w-full h-full  lg:h-full object-cover rounded-xl object-bottom"
          width={1000}
          height={1000}
          alt="Hero Illustration"
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
            className="w-full border border-dashed border-gray-500 text-gray-500 rounded-xl p-4 flex items-center justify-center hover:border-gray-200 hover:text-gray-200"
          >
            <p className="">
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
          }}
        >
          <span id="rewardId" />
          <span id="rewardId2" />
          <span id="rewardId3" />
          <span id="rewardId4" />
          <span id="rewardId5" />
        </button>
        <div className="flex flex-row items-center mb-20 lg:mb-0">
          <Button
            onClick={handleMint}
            disable={!name || !description || !file || loading}
          >
            {loading
              ? `Minting... ${
                  uploadProgress
                    ? ~~uploadProgress > 100
                      ? 100 + "%"
                      : ~~uploadProgress + "%"
                    : ""
                }`
              : "Mint NFT"}
          </Button>
          <Button secondary onClick={() => setShowTxModal(true)}>
            Mint from TX
          </Button>
        </div>
        <Steps
          publickey={publicKey?.toBase58()}
          arweaveId={arweaveId}
          completed={showSuccessModal}
        />
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
      {showTxModal && (
        <MintFromTx
          closeModal={() => setShowTxModal(false)}
          onSubmit={handleMintFromTx}
        />
      )}
    </section>
  );
}
