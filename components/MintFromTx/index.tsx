import { Player } from "@livepeer/react";
import React from "react";
import Button from "../shared/Button";
import Input from "../shared/Input";
import Modal from "../shared/Modal";

export default function MintFromTx({
  onSubmit,
  closeModal,
}: {
  onSubmit: (tx: string) => void;
  closeModal: () => void;
}) {
  const [arweaveId, setArweaveId] = React.useState<string | undefined>(
    undefined
  );

  const handleSubmit = () => {
    if (arweaveId) {
      onSubmit(arweaveId);
    }
  };

  return (
    <Modal>
      <div className="w-[25rem] flex flex-col">
        <p className="text-xl font-medium text-white mt-6">
          Mint from transaction hash
        </p>
        <p className="mt-4 mb-2 text-gray-500">Hash:</p>
        <Input
          className="bg-transparent border border-zinc-800 "
          onChange={(e) => setArweaveId(e.target.value)}
          placeholder={"Enter the arweave tx"}
        />
        <div className="flex flex-row  justify-end">
          <Button onClick={closeModal} secondary>
            Cancel
          </Button>
          <Button
            disable={!arweaveId}
            onClick={handleSubmit}
            className=" ml-4 "
          >
            {" "}
            Mint
          </Button>
        </div>
      </div>
    </Modal>
  );
}
