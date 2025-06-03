import { PublicKey } from "@solana/web3.js";
import { randomUUIDv7, type ServerWebSocket } from "bun";
import type { IncomingRequest, SignUpIncomingRequest, ValidateIncomingRequest } from "common/messageTypes";
import nacl from "tweetnacl";
import nacl_utils from "tweetnacl-util";
import { prismaClient } from "db/client";

const availableValidators: { validatorId: string, ws: ServerWebSocket<unknown>, publicKey: string }[] = [];
const CALLBACKS: { [key: string]: (data: IncomingRequest) => void } = {};
const REWARD_PER_TICK = process.env.REWARD_PER_TICK ? parseInt(process.env.REWARD_PER_TICK) : 1;
Bun.serve({
    fetch(req, server) {
        // Upgrade incoming HTTP requests to WebSocket connections
        if (server.upgrade(req)) {
            return; // Automatically sends a 101 Switching Protocols response
        }
        return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
        open(ws: ServerWebSocket<unknown>) {
            console.log("Connection opened");
            // const data: IncomingRequest = ws;

        },
        async message(ws: ServerWebSocket<unknown>, message: string) {
            const data: IncomingRequest = JSON.parse(message);

            console.log(data, "onmess");
            if (data.type === "signup") {
                // console.log(data.data, "in signup");
                const verified = await verifyMessage(`Signed message for ${data.data.callbackId}, ${data.data.publicKey}`, data.data.publicKey, data.data.signedMessage);
                if (verified) {
                    await validatorSignUp(ws, data.data)
                    
                }
            }
            else if(data.type === "validate"){
                const {url, callbackId, websiteId} = data.data as ValidateIncomingRequest;
                console.log(`Received validate request for ${url} with callbackId ${callbackId}`);
                if (CALLBACKS[callbackId]) {
                    CALLBACKS[callbackId](data);
                    delete CALLBACKS[callbackId];
                }
            }

        },
        close(ws: ServerWebSocket<unknown>, code: number, message: string) {
            console.log(`Connection closed with code ${code}: ${message}`);
        },
    },
    port: 8082,
});

function verifyMessage(message: string, publicKey: string, signedMessage: string) {
    return nacl.sign.detached.verify(nacl_utils.decodeUTF8(message), nacl_utils.decodeBase64(signedMessage), new PublicKey(publicKey).toBytes());
}

async function validatorSignUp(ws: ServerWebSocket<unknown>, data: SignUpIncomingRequest) {


    const validatorDbEntry = await prismaClient.validator.findFirst({
        where: {
            publicKey: data.publicKey
        }
    });
    console.log(validatorDbEntry, "validatorDbEntry");
    let validatorId = "";
    if (!validatorDbEntry) {
        const validator = await prismaClient.validator.create({
            data: {
                publicKey: data.publicKey,
                location: "unknown",
                ip: data.ip,
            }
        });
        validatorId = validator.id;
        // console.log(validator, "validator");
    }
    else {
        validatorId = validatorDbEntry.id;
    }
    // console.log(validatorId, "validatorId");
    availableValidators.push({
        validatorId: validatorId,
        ws,
        publicKey: data.publicKey,
    });
    console.log(availableValidators, "availableValidators");
    ws.send(JSON.stringify({
        type: "signup",
        data: {
            validatorId: validatorId,
            callbackId: data.callbackId
        }
    }));
}

setInterval(async() => {
    const websitesToMonitor = await prismaClient.webSite.findMany({
        where: {
            deleted: false
        }
    });
    // console.log(websitesToMonitor, "websitesToMonitor");
    for (const website of websitesToMonitor) {
        availableValidators.forEach(async (validator) => {
            const callbackId = randomUUIDv7();
            console.log(`Sending request to ${website.url} with callbackId ${callbackId}`);
            validator.ws.send(JSON.stringify({
                type: "validate",
                data: {
                    callbackId: callbackId,
                    websiteId: website.id,
                    url: website.url
                }
            }));

            CALLBACKS[callbackId] = async (data: IncomingRequest)=>{
                if(data.type === "validate"){
                    const {url, callbackId, status, latency, validatorId} = data.data as ValidateIncomingRequest;
                    console.log(`Received validate request for ${website.url} with callbackId ${callbackId}`);

                    const verified = await verifyMessage(`Validate request for ${url}, ${callbackId}, ${validatorId}`, validator.publicKey, data.data.signedMessage);
                    if(!verified){
                        return;
                    }
                    console.log(`${url} is ${status} with latency ${latency}ms`);
                    await prismaClient.$transaction(async (tx)=>{
                        await tx.websiteTicks.create({
                            data: {
                                websiteId: website.id,
                                validatorId,
                                status,
                                latency,
                                createdAt: new Date()
                            }
                        })

                        await tx.validator.update({
                            where: {
                                id: validatorId
                            },
                            data: {
                                pendingPayouts: {
                                    increment: REWARD_PER_TICK
                                }
                            }
                        })
                    })
                }


            }
        });
    }
}, 10000);
