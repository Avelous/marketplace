import { ConnectButton } from "web3uikit"
// import "bootstrap/dist/css/bootstrap.min.css"

export default function ConnectB() {
    return (
        <div className="ml-auto  py-4 px-4  ">
            <ConnectButton moralisAuth={false} />
        </div>
    )
}
