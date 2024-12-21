import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
export async function POST(req:NextRequest){
    try{
        const {name,email,password} = await req.json();
        if(!name || !email || !password){
            return NextResponse.json({error:"All fields are required"},{status:400});
        }
        const existingUser = await prisma.user.findUnique({
            where:{email},
        });
        if(existingUser){
            return NextResponse.json({error:"User already exist"},{status:409});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data:{
                name,
                email,
                password:hashedPassword,
            }
        });

        const token = jwt.sign({userId:newUser.id,email:newUser.email},JWT_SECRET,{
            expiresIn:"1h",
        });
        return NextResponse.json({message: "User created successfully",token, user: newUser},{status:200});
    }catch(error){
        return NextResponse.json({error:"Failed to register user"},{status:500})
    }

}