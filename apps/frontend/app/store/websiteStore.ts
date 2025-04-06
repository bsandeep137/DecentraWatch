import { create } from 'zustand'
import axios from "axios";
import { BASE_URL } from "@/config";

export enum Status {
    UP = "UP",
    DOWN = "DOWN",
    UNKNOWN = "UNKNOWN"
}

export interface Website {
    id: string;
    name: string;
    url: string;
    websiteTicks: {
        id: string;         
        createdAt: Date;
        status : Status;
        latency: number;
        websiteId: string;
        validatorId : string;
    }[];
    processedTicks?: {
        status: Status;

    }[];
}

interface WebsiteStore {
    websites: Website[];
    loading: boolean;
    refetchWebsites: (token: string) => Promise<void>;
    startPolling: (token: string) => void;
    stopPolling: () => void;
    pollingInterval: ReturnType<typeof setInterval> | null;
}

export const useWebsiteStore = create<WebsiteStore>((set, get) => ({
    websites: [],
    loading: false,
    pollingInterval: null,
    refetchWebsites: async (token: string) => {
        try {
            set({ loading: true });
            const data = await axios.get(`${BASE_URL}/api/v1/websites`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set({ websites: data.data.websites });
        } catch (error) {
            console.error("Error fetching websites:", error);
        } finally {
            set({ loading: false });
        }
    },
    startPolling: (token: string) => {
        // Initial fetch
        get().refetchWebsites(token);
        
        // Set up polling every 5 minutes
        const interval = setInterval(() => {
            get().refetchWebsites(token);
        }, 1 * 60 * 1000); // 5 minutes in milliseconds
        
        set({ pollingInterval: interval });
    },
    stopPolling: () => {
        const { pollingInterval } = get();
        if (pollingInterval) {
            clearInterval(pollingInterval);
            set({ pollingInterval: null });
        }
    }
})); 