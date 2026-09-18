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
        {userID:newUser.id,username:newUser.username},
        process.env.JWT_SECRET as string,
        {expiresIn:"7d"}
    );

    return res.status(201).json({user:newUser,token});
}

export async function login (req: Request, res: Response) {
    const loginSchema = z.object({
        username: z.string().min(3),
        password: z.string().min(5),
    });
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success){
        return res.status(400).json({error: parsed.error.flatten()});
    }

    const {username,password} = parsed.data;

    const existingUser = await prisma.user.findFirst({
        where: {username},
    });

    if (!existingUser) {
        return res.status(401).json({error:"Invalid username or password"});
    }

    const valpassword = await bcrypt.compare(password,existingUser.passwordHash)
    
    

    if (!valpassword){
        return res.status(401).json({error:"Invalid username or password"});
    }
    else{
        const token = jwt.sign(
        {userID:existingUser.id,username:existingUser.username},
        process.env.JWT_SECRET as string,
        {expiresIn:"7d"}
    );
        return res.status(200).json({id:existingUser.id,user:existingUser.username,email: existingUser.email,token});
    }
}