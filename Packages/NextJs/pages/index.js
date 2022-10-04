import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTBox from "../components/home/NFTBox"
import Moralis from "moralis"
import networkMapping from "../constants/networkMapping.json"
import * as queries from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import RecentlyListed from "../components/home/RecentlyListed"
import RecentlyAuctioned from "../components/home/RecentlyAuctioned"

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()

    return (
        <div className="w-full">
            <div className="px-9">
                {isWeb3Enabled ? (
                    <>
                        <RecentlyListed />
                        <RecentlyAuctioned />
                    </>
                ) : (
                    <div> Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
