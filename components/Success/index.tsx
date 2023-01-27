import { Player } from "@livepeer/react";
import Link from "next/link";
import React from "react";
import Modal from "../shared/Modal";

export default function Success({
  name,
  arweaveId,
  signature,
}: {
  name?: string;
  arweaveId?: string;
  signature?: string;
}) {
  return (
    <Modal>
      <p className="text-2xl font-bold text-white mt-6">Yay! you did it</p>
      <span className="text-gray-500 mt-3 mb-3">
        You have successfully minted your video NFT.
        <Link
          href={`https://explorer.solana.com/tx/${signature}`}
          target="_blank"
          className="text-primary"
        >
          {" "}
          View on Explorer
        </Link>
        <br />
      </span>

      <Player
        title={name}
        src={"ar://" + arweaveId}
        autoPlay
        muted
        autoUrlUpload={{
          fallback: true,
          arweaveGateway: "https://arweave.net",
        }}
      />
    </Modal>
  );
}
