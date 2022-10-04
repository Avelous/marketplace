import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis, useMoralisQuery } from "react-moralis"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import nftMarketplaceAbi from "../../constants/NftMarketplace.json"
import { useQuery } from "@apollo/client"
import Link from "next/link"

export default function NFTBoxProfile({
    tokenId,
    imageUri,
    description,
    title,
    marketplaceAddress,
    nftAddress,
    nftKey,
}) {
    const link = "/asset/" + nftAddress + "/" + tokenId

    return (
        <Link href={link}>
            <div className="cursor-pointer">
                {imageUri ? (
                    <div className="  rounded-md m-2 bg-zinc-900 h-max">
                        <div className="p-2 ">
                            <div className="flex justify-center w-full">
                                <Image
                                    className=" flex rounded-md mb-10"
                                    loader={() => imageUri}
                                    src={imageUri}
                                    height="300"
                                    width="300"
                                    alt=""
                                />
                            </div>
                            <div className=" px-2 mb-2 mt-5 ">
                                <h6 className=" text-xs mb-1 truncate">
                                    #{tokenId}{" "}
                                </h6>
                                <h6 className=" text-s font-bold truncate">
                                    {title}
                                </h6>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>Loading</div>
                )}
            </div>
        </Link>
    )
}
