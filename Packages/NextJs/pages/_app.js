import "../styles/globals.css"
// import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import Head from "next/head"
// import "bootstrap/dist/css/bootstrap.min.css"
import { NotificationProvider } from "web3uikit"

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.thegraph.com/subgraphs/name/avelous/marketplace",
})

function MyApp({ Component, pageProps }) {
    return (
        <div className="bg-gray-800">
            <Head>
                <title>NFT Marketplace</title>
                <meta name="NFT Marketplace" content="NFT Marketplace" />
                <link rel="icon" href="o" />
            </Head>
         
                <MoralisProvider initializeOnMount={false}>
                    <ApolloProvider client={client}>
                        <NotificationProvider>
                            <div>
                                <Header />
                                <Component {...pageProps} />
                            </div>
                        </NotificationProvider>
                    </ApolloProvider>
                </MoralisProvider>
  
        </div>
    )
}

export default MyApp
