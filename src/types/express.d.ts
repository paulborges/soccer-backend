export interface AuthPayload{
    userID: number; 
    username:string;
}

declare global{
    namespace Express{
        interface Request{
            user?:AuthPayload;
        }
    }
}

export {};