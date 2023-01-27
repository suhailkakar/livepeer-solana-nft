import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useMemo } from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import { LivepeerConfig } from "@livepeer/react";
import client from "../client/livepeer";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

require("@solana/wallet-adapter-react-ui/styles.css");

function MyApp({ Component, pageProps }: AppProps) {
  const network = WalletAdapterNetwork.Mainnet;

  const endpoint =
    "https://solana-mainnet.g.alchemy.com/v2/lqJNpg_IYUwHGwO6jPcrI7abZhueH9mv";

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <LivepeerConfig client={client}>
            <Component {...pageProps} />
            <Toaster />
          </LivepeerConfig>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
