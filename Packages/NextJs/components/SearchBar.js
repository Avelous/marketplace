import React, { useState } from "react"
import { Input } from "web3uikit"
import { AiOutlineSearch } from "react-icons/ai"
import Link from "next/link"

const SearchBar = () => {
    const [searchInput, setSearchInput] = useState("")

    return (
        <div className="flex flex-row items-center">
            <Input
                type="search"
                placeholder="Search Collection or Address"
                onChange={(e) => {
                    e.preventDefault()
                    setSearchInput(e.target.value)
                }}
                value={searchInput}
            ></Input>
            {searchInput ? (
                // <Link href={"/collection/" + searchInput}>
                <div className="rounded-full border-2 flex justify-center items-center ml-4 h-9 w-9">
                    <AiOutlineSearch height={500} />
                </div>
            ) : (
                // </Link>
                <div className="rounded-full border-2 flex justify-center items-center ml-4 h-9 w-9">
                    <AiOutlineSearch height={500} />
                </div>
            )}
        </div>
    )
}

export default SearchBar
