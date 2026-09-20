import jwt from "jsonwebtoken";
import { NextFunction, Request,Response } from "express";
import type { AuthPayload } from "../types/express";


export async function authentication (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({error:'Missing or malformed Authorization header'});
    }

    const token = authHeader.split(" ")[1];

    if (!token){
        return res.status(401).json({error:"Missing or malformed Authrorization header"});
    }

    try{
        const decoded = jwt.verify(token,  process.env.JWT_SECRET as string) as unknown as AuthPayload;

        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({error:"Invalid or expired token"});
    }
}
