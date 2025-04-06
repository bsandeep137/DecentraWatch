"use client"
import { Website } from "@/app/store/websiteStore"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
export const WebsiteCard = ({website}:{website:Website}) => {
    const [isExpanded, setisExpanded] = useState(false)
    const sortedTicks = [...website.websiteTicks].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Get the most recent 30 minutes of ticks
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const recentTicks = sortedTicks.filter(tick => 
    new Date(tick.createdAt) > thirtyMinutesAgo
    );

    // Aggregate ticks into 3-minute windows (10 windows total)
    const windows: Status[] = [];
    for (let i = 0; i < 10; i++) {
        const windowStart = new Date(Date.now() - (i + 1) * 3 * 60 * 1000);
        const windowEnd = new Date(Date.now() - i * 3 * 60 * 1000);
        
        const windowTicks = recentTicks.filter(tick => {
          const tickTime = new Date(tick.createdAt);
          return tickTime >= windowStart && tickTime < windowEnd;
        });

        // Window is considered up if majority of ticks are up
        const upTicks = windowTicks.filter(tick => tick.status === Status.UP).length;
        windows[9 - i] = windowTicks.length === 0 ? Status.UNKNOWN : (upTicks / windowTicks.length) >= 0.5 ? Status.UP : Status.DOWN;
      }
      const currentStatus = windows[windows.length - 1];
      const uptimePercentage = ((sortedTicks.filter(tick => tick.status === Status.UP).length / sortedTicks.length) * 100).toFixed(2);
      const lastChecked = new Date(sortedTicks[0]?.createdAt).toLocaleString();
      console.log(lastChecked)

    return (
        <div className="flex flex-col justify-between items-center w-full h-full bg-slate-800   pt-4  rounded-md">
            <div className="flex justify-between items-center w-full px-4 pb-3">
                <div className="flex items-center gap-2">
                    <StatusIndicator status={currentStatus} />
                    <h1>{website.url}</h1>
                </div>
                <div className="flex items-center gap-2">
                    {uptimePercentage} % uptime 
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4 hover:cursor-pointer" onClick={() => {
                            setisExpanded(!isExpanded)
                        }} />
                    ) : (
                        <ChevronDown className="w-4 h-4 hover:cursor-pointer" onClick={() => {
                            setisExpanded(!isExpanded)
                        }} />
                    )}
                </div>
                
            </div>
            {isExpanded && (
                <div className="flex justify-between items-center w-full px-4 rounded-b-lg  bg-slate-700  ">
                    <div className=" flex flex-col  justify-between pb-3">
                        <div className="mt-3 flex flex-col gap-2">
                            <p className="text-xs text-gray-600 dark:text-gray-300 ">Last 30 minutes status:</p>
                            <UptimeTicks ticks={windows} />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 pt-1  ">
                            Last checked: {lastChecked}
                        </p>
                    </div>
                </div>
            )}
           
               
            
        </div>
    )
}


function UptimeTicks({ ticks }: { ticks: Status[] }) {
    return (
      <div className="flex gap-1 ">
        {ticks.map((tick, index) => (
          <div
            key={index}
            className={`w-8 h-2 rounded ${
              tick === Status.UP ? 'bg-green-500' : tick === Status.DOWN ? 'bg-red-500' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    );
}

enum Status {
    UP = "UP",
    DOWN = "DOWN",
    UNKNOWN = "UNKNOWN"
}

function StatusIndicator({status}: {status : Status}) {
    return (
        <div className={`w-3 h-3 rounded-full ${
            status === Status.UP ? "bg-green-500" : 
            status === Status.DOWN ? "bg-red-500" : 
            "bg-gray-500"
        }`}>
        </div>
    )
}