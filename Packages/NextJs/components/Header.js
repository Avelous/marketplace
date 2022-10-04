import React from "react"
import Link from "next/link"
import ConnectB from "./ConnectB"
import { isWeb3Enabled } from "react-moralis"
import SearchBar from "./SearchBar"

const Header = () => {
    return (
        <nav className=" shadow-lg px-10 py-8 flex flex-row justify-between items-center h-4">
            <Link href="/">
                <h1 className="py-4 px-4 font-bold text-lg  cursor-pointer">
                    MARKETPLACE
                </h1>
            </Link>
            <SearchBar />
            <div className="flex flex-row items-center  ">
                <Link href="/">
                    <a className=" p-6 no-underline ">Home</a>
                </Link>

                <Link href="/profile">
                    <a className="mr-2 p-6 no-underline ">Profile</a>
                </Link>

                <ConnectB />
            </div>
        </nav>
    )
}

export default Header
