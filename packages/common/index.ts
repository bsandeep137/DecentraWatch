export interface SignUpIncomingRequest {
    publicKey: string;
    signedMessage: string;
    ip: string;
    callbackId: string;
}

export interface SignUpOutgoingRequest {
    validatorId: string;
    callbackId: string;
}

export interface ValidateIncomingRequest {
    url: string;
    callbackId: string;
    status: "UP" | "DOWN";
    latency: number;
    websiteId: string;
    validatorId: string;
    signedMessage: string;
}

export interface ValidateOutgoingRequest {
    url: string;
    websiteId: string;
    callbackId: string;
}

export type IncomingRequest =  {
    type: "signup";
    data: SignUpIncomingRequest;
} | {
    type: "validate";
    data: ValidateIncomingRequest;
}



export type OutgoingRequest =  {
    type: "signup";
    data: SignUpOutgoingRequest;
} | {
    type: "validate";
    data: ValidateOutgoingRequest;
}


