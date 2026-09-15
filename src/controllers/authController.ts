import prisma from "../lib/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request,Response } from "express";

export async function signUp (req: Request, res: Response) {

    const signUpSchema = z.object({
        username: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(5),
    });

    const parsed = signUpSchema.safeParse(req.body);
    if (!parsed.success){
        return res.status(400).json({error: parsed.error.flatten()});
    }

    const {username,email,password} = parsed.data;

    const existingUser = await prisma.user.findFirst({
        where: {
            OR:[{username},{email}],
        },
    });

    if (existingUser) {
        return res.status(409).json({error:"Username or email is already registered"});
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password,saltRounds);
    
    const newUser = await prisma.user.create({
        data: {username, email, passwordHash},
        select: {id:true, username: true, email: true, createdAt: true},
    });

    const token = jwt.sign(
        {userId:newUser.id,username:newUser.username},
        process.env.JWT_SECRET as string,
        {expiresIn:"7d"}
    );

    return res.status(201).json({user:newUser,token});
}