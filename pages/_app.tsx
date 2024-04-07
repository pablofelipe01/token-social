import type { AppProps } from "next/app";
import { ThirdwebProvider, embeddedWallet, smartWallet } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { ACCOUNT_FACTORY_CONTRACT_ADDRESS } from "../constants/contracts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ChakraProvider } from '@chakra-ui/react';


// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "polygon";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={activeChain}
      supportedWallets={[
        smartWallet(embeddedWallet(), {
          factoryAddress: ACCOUNT_FACTORY_CONTRACT_ADDRESS,
          gasless: true,
        })
      ]}
      authConfig={{
        domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
        authUrl: "/api/auth"
      }}
    >
      <ChakraProvider>

      <Navbar />
      <Component {...pageProps} />
      <Footer />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;