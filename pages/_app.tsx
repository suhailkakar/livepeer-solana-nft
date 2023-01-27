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
    "https://summer-yolo-hill.solana-mainnet.discover.quiknode.pro/326e3b1542916f65b64c43ba96ee6851747cda43/";
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
