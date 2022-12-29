import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { AiFillGithub } from "react-icons/ai";

export default function Navbar() {
  return (
    <div className="absolute top-0 right-0 pr-4 mt-4 mr-10 flex items-center ">
      <Link href={"https://github.com/suhailkakar/livepeer-solana-nft"}>
        <AiFillGithub size={30} color={"#00FFB2"} className="mr-4" />
      </Link>

      <WalletMultiButton
        style={{
          background: "#00FFB2",
          color: "#000",
          borderRadius: "10px",
          padding: "10px 13px",
          fontSize: "16px",
          fontWeight: "500",
        }}
      />
    </div>
  );
}
