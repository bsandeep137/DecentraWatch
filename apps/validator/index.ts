import { Keypair } from "@solana/web3.js";
import { randomUUIDv7 } from "bun";
import type { OutgoingRequest, SignUpOutgoingRequest, ValidateOutgoingRequest } from "common/messageTypes";
import nacl from "tweetnacl";
import nacl_utils from "tweetnacl-util";
import 'dotenv/config';
import bs58 from "bs58";

const CALLBACKS: {[callbackId: string]: (data: SignUpOutgoingRequest) => void} = {}
let validatorId: string | null = null;
async function main() {
    if (!process.env.VALIDATOR_SECRET_KEY) {
        throw new Error("VALIDATOR_SECRET_KEY environment variable is required");
    }
    const secretKey = bs58.decode(process.env.VALIDATOR_SECRET_KEY);
    const keypair = Keypair.fromSecretKey(secretKey);
    console.log(keypair.secretKey.toBase64());
    const ws = new WebSocket("ws://localhost:8082");
    console.log("Connecting to hub", ws);

    ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log(data, "onmessage");
        if (data.type === "signup") {
            CALLBACKS[data.data.callbackId]?.(data.data)
            delete CALLBACKS[data.data.callbackId];
        } else if (data.type == "validate") {
            console.log(data, "onmessage");
            await validateHandler(ws, data.data, keypair);
        }
    }

    ws.onopen = async () => {
        const callbackId = randomUUIDv7();
        CALLBACKS[callbackId] = (data: SignUpOutgoingRequest) => {
            validatorId = data.validatorId;
        }
        console.log(callbackId, "onopen");
        const signedMessage = await signMessage(`Signed message for ${callbackId}, ${keypair.publicKey}`, keypair);
        // console.log(signedMessage);

        ws.send(JSON.stringify({
            type: "signup",
            data: {
                callbackId,
                ip: '192.168.29.190',
                publicKey: keypair.publicKey,
                signedMessage,
            },
        }));
       
    }

  
}
async function signMessage(message: string, keypair: Keypair) {
    const messageBuffer = nacl_utils.decodeUTF8(message);
    // Sign the message
    const signature = nacl.sign.detached(messageBuffer, keypair.secretKey);
    // Convert the signature to base64 for transmission
    return nacl_utils.encodeBase64(signature);
}

async function validateHandler(ws: WebSocket, { url, callbackId, websiteId }: ValidateOutgoingRequest, keypair: Keypair) {
    // const {url, callbackId,websiteId} = data.data as ValidateOutgoingRequest;
    console.log(`Received validate request for ${url} with callbackId ${callbackId}`);
    const signedMessage = await signMessage(`Validate request for ${url}, ${callbackId}, ${validatorId}`,keypair);
    const startTime = Date.now();
    try{
        const response = await fetch(url);
        const endTime = Date.now();
        const latency = endTime - startTime;
        const status = response.status;
        console.log(`${url} is ${status == 200 ? "UP" : "DOWN"} with latency ${latency}ms`);
        ws.send(JSON.stringify({
            type: "validate",
            data: {
                callbackId,
                websiteId,
                status: status == 200 ? "UP" : "DOWN",
                latency,
                validatorId,
                signedMessage,
                url
            }
        }));
        
    }catch(error){
        console.error(error);
        ws.send(JSON.stringify({
            type: "validate",
            data: {
                callbackId,
                websiteId,
                status: "DOWN",
                latency: 1000,
                validatorId,
                signedMessage,
                url
            }
        }));
    }
}
main();