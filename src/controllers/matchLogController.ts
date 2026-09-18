import { error } from "node:console";
import { z } from "zod";
import prisma from "../lib/prisma";
import { Request,Response } from "express";


export async function createMatchLog(req: Request, res: Response) {
    const matchLogSchema = z.object({
        result: z.enum(["WIN","LOSS","DRAW"]),
        goalsFor: z.number().int().min(0),
        goalsAgainst: z.number().int().min(0),
        shotsTaken: z.number().int().min(0),
        passesMade: z.number().int().min(0),
        dribbleCount: z.number().int().min(0),
        tackleCount: z.number().int().min(0),
    });
    
    const parsed = matchLogSchema.safeParse(req.body);
    if(!parsed.success) {
        return res.status(400).json({error:parsed.error.flatten});
    }

    const userID = req.user!.userID;


    const matchLog = await prisma.matchLog.create({
        data: {
            userID,
            ...parsed.data,
        },
    });

    return res.status(201).json({matchLog});
}

export async function getMatchLog(req: Request, res: Response) {
    const userID = req.user!.userID;
    const matchLogs = await prisma.matchLog.findMany({
        where: {userID},
        orderBy: {playedAt: "desc"},
    });

    return res.json({matchLogs});
}

