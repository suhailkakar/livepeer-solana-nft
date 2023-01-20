import { Player } from "@livepeer/react";
import React from "react";
import Modal from "../shared/Modal";

export default function Success({
  name,
  arweaveId,
}: {
  name?: string;
  arweaveId?: string;
}) {
  return (
    <Modal>
      <p className="text-2xl font-bold text-white mt-6">Yay! you did it</p>
      <p className="text-gray-500 mt-3 mb-3">
        You have successfully minted your video NFT
        <br />
      </p>

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
