import {
  bundlrStorage,
  Metaplex,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";

export function useMetaplex() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const metaplex = useMemo(() => {
    return Metaplex.make(connection)
      .use(walletAdapterIdentity(wallet))
      .use(
        bundlrStorage({
          providerUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT,
          timeout: 60000,
        })
      );
  }, [connection, wallet]);

  return metaplex;
}
