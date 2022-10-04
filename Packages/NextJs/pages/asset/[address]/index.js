import { useRouter } from "next/router"

export default function Address() {
    const router = useRouter()
    const { address } = router.query

    return <p>address: {address}</p>
}
