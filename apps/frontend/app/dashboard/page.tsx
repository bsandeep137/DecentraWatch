"use client"
import { DialogButton } from "@/components/ui/dialog"
import { WebsiteCard } from "@/components/WebsiteCard"
import { useWebsiteStore } from "@/app/store/websiteStore"
export default function Dashboard() {
    const {websites} = useWebsiteStore();
    return (
        <div className="flex h-screen flex-col items-center ">
            <div className="flex pt-10 justify-center w-3xl mb-2">
                <h1 className="text-2xl font-bold w-full ">Uptime Monitor</h1>
                <DialogButton ></DialogButton>
            </div>

            <div className="mt-2 flex flex-col gap-2 justify-center w-3xl">
                {websites.map((website) => (
                    website && (
                        <WebsiteCard key={website.id} website={website} />
                    )
                   
                ))}
            </div>
        </div>
    )
}

