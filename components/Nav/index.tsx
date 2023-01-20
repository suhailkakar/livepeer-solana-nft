import React from "react";

import Link from "next/link";
import { AiFillGithub } from "react-icons/ai";
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Navbar() {
  return (
    <div className="absolute top-0 right-0 pr-4 mt-4 mr-10 flex items-center ">
      <Link href={"https://github.com/suhailkakar/livepeer-solana-nft"}>
        <AiFillGithub size={30} color={"#00FFB2"} className="mr-4" />
      </Link>

      <WalletMultiButtonDynamic
        style={{
          backgroundColor: "#00FFB2",
          color: "#222222",
          borderRadius: "0.7rem",
        }}
      />
    </div>
  );
}
