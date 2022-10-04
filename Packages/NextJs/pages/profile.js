import React, { useState, useEffect } from "react"
import { useMoralis } from "react-moralis"
import { Tab } from "web3uikit"

import Collected from "../components/profileTabs/collected"
import Activity from "../components/profileTabs/Activity"
import Favorited from "../components/profileTabs/Favorited"
import Created from "../components/profileTabs/Created"

export default function Profile() {
    const [activeTab, setActiveTab] = useState("Collected")

    return (
        <div className="">
            <div className="h-80 relative ">
                <div className="h-4/5 bg-zinc-900"></div>
                <div className="h-1/5"></div>
                <div className="z-10 h-44 w-44 bg-emerald-900 absolute bottom-5 left-10 ml-5"></div>
            </div>
            <div className="bg-zinc-900 h-10"></div>
            <div className="bg-zinc-900 h-10"></div>
            <nav className=" px-10 flex h-10 justify-items-start mt-2">
                <div className="flex pl-8 ">
                    <div
                        className="mr-2"
                        onClick={() => setActiveTab("Collected")}
                    >
                        Collected
                    </div>
                    <div
                        className="mr-2"
                        onClick={() => setActiveTab("Created")}
                    >
                        Created
                    </div>
                    <div
                        className="mr-2"
                        onClick={() => setActiveTab("Favorited")}
                    >
                        Favorited
                    </div>
                    <div
                        className="mr-2 "
                        onClick={() => setActiveTab("Activity")}
                    >
                        Activity
                    </div>
                </div>
            </nav>
            <div className="px-10">
                {activeTab == "Collected" ? (
                    <Collected />
                ) : activeTab == "Created" ? (
                    <Created />
                ) : activeTab == "Favorited" ? (
                    <Favorited />
                ) : activeTab == "Activity" ? (
                    <Activity />
                ) : (
                    <Collected />
                )}{" "}
            </div>
        </div>
    )
}
