import React from "react";
import Button from "./shared/Button";
import Modal from "./shared/Modal";

export default function FundModal({
  onFund,
  onClose,
  file,
  price,
  fundLoading,
}: {
  onFund: () => void;
  onClose: () => void;
  file: File;
  price: string | undefined;
  fundLoading: boolean;
}) {
  return (
    <Modal sm>
      {renderIcon}
      <p className="text-2xl font-bold text-white mt-6">Upload to Bundlr</p>
      <p className="text-gray-500 mt-3">
        To mint an NFT, you need to fund your Bundlr wallet with SOL. <br />
        <br />
        In order to store{" "}
        <code className="text-gray-300 text-sm border border-zinc-800 bg-zinc-990 rounded-md p-1">
          {file?.name?.length > 20
            ? file?.name.slice(0, 20) + "..."
            : file?.name}
        </code>{" "}
        in Arweave, you will need to fund your wallet with{" "}
        <code className="text-gray-300 text-sm border border-zinc-800 bg-zinc-990 rounded-md p-1">
          {price}
        </code>{" "}
        SOL
      </p>
      <div className="flex flex-row items-center">
        <Button disable={fundLoading} onClick={onFund}>
          {fundLoading ? "Loading..." : "Upload to Bundlr"}
        </Button>
      </div>
    </Modal>
  );
}

const renderIcon = (
  <svg
    width="97"
    height="96"
    viewBox="0 0 97 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="48.5"
      cy="48"
      r="48"
      fill="url(#paint0_linear_880_5115)"
      fill-opacity="0.1"
    ></circle>
    <circle
      cx="48.5"
      cy="48"
      r="47"
      stroke="url(#paint1_linear_880_5115)"
      stroke-opacity="0.4"
      stroke-width="2"
    ></circle>
    <g clip-path="url(#clip0_880_5115)">
      <path
        d="M65.5769 28.1523H31.4231C27.6057 28.1523 24.5 31.258 24.5 35.0754V60.9215C24.5 64.7389 27.6057 67.8446 31.4231 67.8446H65.5769C69.3943 67.8446 72.5 64.7389 72.5 60.9215V35.0754C72.5 31.258 69.3943 28.1523 65.5769 28.1523ZM69.7308 52.1523H59.5769C57.2865 52.1523 55.4231 50.289 55.4231 47.9985C55.4231 45.708 57.2864 43.8446 59.5769 43.8446H69.7308V52.1523ZM69.7308 41.0754H59.5769C55.7595 41.0754 52.6539 44.1811 52.6539 47.9985C52.6539 51.8159 55.7595 54.9215 59.5769 54.9215H69.7308V60.9215C69.7308 63.2119 67.8674 65.0754 65.5769 65.0754H31.4231C29.1327 65.0754 27.2692 63.212 27.2692 60.9215V35.0754C27.2692 32.785 29.1326 30.9215 31.4231 30.9215H65.5769C67.8673 30.9215 69.7308 32.7849 69.7308 35.0754V41.0754Z"
        fill="url(#paint2_linear_880_5115)"
      ></path>
      <path
        d="M61.4231 46.6172H59.577C58.8123 46.6172 58.1924 47.2371 58.1924 48.0018C58.1924 48.7665 58.8123 49.3863 59.577 49.3863H61.4231C62.1878 49.3863 62.8077 48.7664 62.8077 48.0018C62.8077 47.2371 62.1878 46.6172 61.4231 46.6172Z"
        fill="url(#paint3_linear_880_5115)"
      ></path>
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_880_5115"
        x1="3.41664"
        y1="98.0933"
        x2="103.05"
        y2="8.42498"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#9945FF"></stop>
        <stop offset="0.14" stop-color="#8A53F4"></stop>
        <stop offset="0.42" stop-color="#6377D6"></stop>
        <stop offset="0.79" stop-color="#24B0A7"></stop>
        <stop offset="0.99" stop-color="#00D18C"></stop>
        <stop offset="1" stop-color="#00D18C"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_880_5115"
        x1="3.41664"
        y1="98.0933"
        x2="103.05"
        y2="8.42498"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#9945FF"></stop>
        <stop offset="0.14" stop-color="#8A53F4"></stop>
        <stop offset="0.42" stop-color="#6377D6"></stop>
        <stop offset="0.79" stop-color="#24B0A7"></stop>
        <stop offset="0.99" stop-color="#00D18C"></stop>
        <stop offset="1" stop-color="#00D18C"></stop>
      </linearGradient>
      <linearGradient
        id="paint2_linear_880_5115"
        x1="25.9583"
        y1="68.7101"
        x2="67.2337"
        y2="23.7879"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#9945FF"></stop>
        <stop offset="0.14" stop-color="#8A53F4"></stop>
        <stop offset="0.42" stop-color="#6377D6"></stop>
        <stop offset="0.79" stop-color="#24B0A7"></stop>
        <stop offset="0.99" stop-color="#00D18C"></stop>
        <stop offset="1" stop-color="#00D18C"></stop>
      </linearGradient>
      <linearGradient
        id="paint3_linear_880_5115"
        x1="58.3326"
        y1="49.4467"
        x2="61.0002"
        y2="45.4453"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#9945FF"></stop>
        <stop offset="0.14" stop-color="#8A53F4"></stop>
        <stop offset="0.42" stop-color="#6377D6"></stop>
        <stop offset="0.79" stop-color="#24B0A7"></stop>
        <stop offset="0.99" stop-color="#00D18C"></stop>
        <stop offset="1" stop-color="#00D18C"></stop>
      </linearGradient>
      <clipPath id="clip0_880_5115">
        <rect
          width="48"
          height="48"
          fill="white"
          transform="translate(24.5 24)"
        ></rect>
      </clipPath>
    </defs>
  </svg>
);
